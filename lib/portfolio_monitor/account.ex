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

  def change_bitmex_acc(bitmex_acc, changes \\ %{}) do
    bitmex_acc
    |> BitmexAcc.changeset(changes)
  end

  def bitmex_acc_with_details(user) do
    query =
      from b in BitmexAcc,
        join: p in assoc(b, :positions),
        join: m in assoc(b, :margins),
        where: b.user_id == ^user.id,
        order_by: [desc: [p.inserted_at, m.inserted_at]],
        # handle only return 1st row of each bitmex_acc_id
        distinct: b.id,
        select: %{
          id: b.id,
          name: b.name,
          available_margin: b.available_margin,
          wallet_balance: b.wallet_balance,
          # will return strings, which is fine because may be a float
          current_qty: fragment("?->>'currentQty'", p.data),
          liquidation_price: fragment("?->>'liquidationPrice'", p.data),
          unrealized_pnl: fragment("?->>'unrealisedPnl'", p.data),
          home_notional: fragment("?->>'homeNotional'", p.data),
          margin_balance: fragment("?->>'marginBalance'", m.data),
          realised_pnl: fragment("?->>'realisedPnl'", m.data)
        }

    Repo.all(query)
  end
end
