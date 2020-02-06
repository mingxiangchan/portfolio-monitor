defmodule PortfolioMonitor.Account do
  import Ecto.Query, warn: false
  alias PortfolioMonitor.Repo

  alias PortfolioMonitor.Account.BitmexAcc
  alias PortfolioMonitor.Account.User
  alias PortfolioMonitorWeb.Endpoint
  alias PortfolioMonitor.Portfolio

  def list_bitmex_accs do
    Repo.all(BitmexAcc)
  end

  def list_bitmex_accs(%User{} = user, :with_details) do
    bitmex_acc_with_latest_historical_data_query()
    |> where([a], a.user_id == ^user.id)
    |> Repo.all()
  end

  def list_bitmex_accs(%User{} = user) do
    query = from a in BitmexAcc, where: a.user_id == ^user.id
    Repo.all(query)
  end

  def get_bitmex_acc(id) do
    Repo.get(BitmexAcc, id)
  end

  def create_bitmex_acc(%User{} = user, attrs \\ %{}) do
    result =
      user
      |> Ecto.build_assoc(:bitmex_accs, %{})
      |> BitmexAcc.changeset(attrs)
      |> Repo.insert()

    with {:ok, acc} <- result do
      Task.start(fn -> broadcast_acc_update(acc) end)
      result
    end
  end

  def broadcast_acc_update(%BitmexAcc{} = acc) do
    acc_data =
      bitmex_acc_with_latest_historical_data_query()
      |> where([a], a.id == ^acc.id)
      |> Repo.one()

    Endpoint.broadcast("bitmex_accs:#{acc.user_id}", "acc_update", %{acc: acc_data})
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

  def ordered_historical_data_query do
    from h in Portfolio.HistoricalDatum, order_by: [desc: h.inserted_at]
  end

  def bitmex_acc_with_latest_historical_data_query do
    from a in BitmexAcc,
      left_join: h in assoc(a, :historical_data),
      order_by: [desc: h.inserted_at],
      preload: [historical_data: ^ordered_historical_data_query()],
      distinct: [a.id],
      select_merge: %{
        margin_balance: h.margin_balance,
        wallet_balance_now: h.wallet_balance
      }
  end
end
