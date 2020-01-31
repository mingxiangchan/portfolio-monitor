defmodule PortfolioMonitor.Account do
  import Ecto.Query, warn: false
  alias PortfolioMonitor.Repo

  alias PortfolioMonitor.Account.BitmexAcc
  alias PortfolioMonitor.Sync
  alias PortfolioMonitor.Account.User
  alias PortfolioMonitor.Portfolio

  def list_bitmex_accs do
    Repo.all(BitmexAcc)
  end

  def create_bitmex_acc(user \\ %User{}, attrs \\ %{}) do
    user
    |> Ecto.build_assoc(:bitmex_accs, %{})
    |> BitmexAcc.changeset(attrs)
    |> Repo.insert()
    |> case do
      {:ok, bitmex_acc} ->
        Sync.Supervisor.start_child(bitmex_acc)
        {:ok, bitmex_acc}

      error ->
        error
    end
  end

  def change_bitmex_acc(bitmex_acc) do
    BitmexAcc.changeset(bitmex_acc, %{})
  end

  def current_user_with_accs(conn) do
    user = Pow.Plug.current_user(conn)
    query = from u in User, where: u.id == ^user.id, preload: [:bitmex_accs]
    Repo.one(query)
  end

  def bitmex_acc_with_details(user) do
    last_available_margin =
      from m in Portfolio.Margin,
        where: fragment("?->>'availableMargin' IS NOT NULL", m.data),
        order_by: [desc: m.inserted_at]

    last_wallet_balance =
      from m in Portfolio.Margin,
        where: fragment("?->>'walletBalance' IS NOT NULL", m.data),
        order_by: [desc: m.inserted_at]

    from b in BitmexAcc,
      join: p in assoc(b, :positions),
      join: m in assoc(b, :margins),
      join: mam in subquery(last_available_margin),
      on: mam.bitmex_acc_id == b.id,
      join: mwb in subquery(last_wallet_balance),
      on: mwb.bitmex_acc_id == b.id,
      where: b.user_id == ^user.id,
      order_by: [desc: [p.inserted_at, m.inserted_at]],
      distinct: b.id,
      select: %{
        id: b.id,
        name: b.name,
        current_qty: fragment("(?->>'currentQty')::integer", p.data),
        liquidation_price: fragment("(?->>'liquidationPrice')::integer", p.data),
        unrealized_pnl: fragment("(?->>'unrealisedPnl')::integer", p.data),
        margin_balance: fragment("(?->>'marginBalance')::integer", m.data),
        available_margin: fragment("(?->>'availableMargin')::integer", mam.data),
        wallet_balance: fragment("(?->>'walletBalance')::integer", mwb.data)
      }
  end
end
