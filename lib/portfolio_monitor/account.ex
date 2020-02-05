defmodule PortfolioMonitor.Account do
  import Ecto.Query, warn: false
  alias PortfolioMonitor.Repo

  alias PortfolioMonitor.Account.BitmexAcc
  alias PortfolioMonitor.Account.User

  def list_bitmex_accs do
    Repo.all(BitmexAcc)
  end

  def list_bitmex_accs(%User{} = user, :with_details) do
    query =
      from a in BitmexAcc,
        join: h in assoc(a, :historical_data),
        where: a.user_id == ^user.id,
        order_by: [desc: h.inserted_at],
        distinct: [a.id]

    query |> with_details_select |> Repo.all()
  end

  def list_bitmex_accs(%User{} = user) do
    query = from a in BitmexAcc, where: a.user_id == ^user.id
    Repo.all(query)
  end

  def get_bitmex_acc(id) do
    Repo.get(BitmexAcc, id)
  end

  def create_bitmex_acc(%User{} = user, attrs \\ %{}) do
    user
    |> Ecto.build_assoc(:bitmex_accs, %{})
    |> BitmexAcc.changeset(attrs)
    |> Repo.insert()
  end

  def change_bitmex_acc(bitmex_acc, changes \\ %{}) do
    bitmex_acc
    |> BitmexAcc.changeset(changes)
  end

  def update_bitmex_acc(%BitmexAcc{} = bitmex_acc, attrs) do
    bitmex_acc
    |> BitmexAcc.changeset(attrs)
    |> Repo.update()
  end

  def delete_bitmex_acc(%BitmexAcc{} = bitmex_acc) do
    Repo.delete(bitmex_acc)
  end

  def bitmex_acc_with_details(user) do
    query = from b in BitmexAcc, where: b.user_id == ^user.id
    Repo.all(query)
  end

  def with_details_select(query) do
    select(query, [a, h], %{
      id: a.id,
      name: a.name,
      notes: a.notes,
      depositBtc: a.deposit_btc,
      depositUsd: a.deposit_usd,
      marginBalance: h.margin_balance,
      walletBalanceNow: h.wallet_balance
    })
  end
end
