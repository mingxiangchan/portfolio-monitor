defmodule PortfolioMonitor.Portfolio do
  @moduledoc """
  The Portfolio context.
  """

  require Logger
  import Ecto.Query, warn: false
  alias PortfolioMonitor.Repo
  alias PortfolioMonitor.Account.User
  alias PortfolioMonitor.Portfolio.HistoricalDatum
  alias PortfolioMonitor.Portfolio.BitmexHistory
  alias PortfolioMonitor.Portfolio.BitmexAcc
  alias PortfolioMonitorWeb.Endpoint

  # Write Actions

  def create_historical_datum(attrs \\ %{}) do
    %HistoricalDatum{}
    |> HistoricalDatum.changeset(attrs)
    |> Repo.insert()
  end

  def create_bitmex_history(changes) do
    %BitmexHistory{}
    |> BitmexHistory.changeset(changes)
    |> Repo.insert()
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

  def change_bitmex_acc(bitmex_acc, changes \\ %{}) do
    bitmex_acc
    |> BitmexAcc.changeset(changes)
  end

  def update_bitmex_acc(%BitmexAcc{} = bitmex_acc, attrs) do
    result =
      bitmex_acc
      |> BitmexAcc.changeset(attrs)
      |> Repo.update()

    with {:ok, updated_acc} <- result do
      broadcast_acc_update(updated_acc)
      {:ok, updated_acc}
    end
  end

  def delete_bitmex_acc(%BitmexAcc{} = bitmex_acc) do
    with {:ok, acc} <- Repo.delete(bitmex_acc) do
      Endpoint.broadcast("bitmex_accs:#{acc.user_id}", "acc_deleted", %{acc: %{id: acc.id}})
      {:ok, acc}
    end
  end

  # Read Actions

  def get_latest_price(is_testnet) do
    query =
      from h in BitmexHistory,
        where: h.is_testnet == ^is_testnet,
        where: h.symbol == "XBTUSD",
        order_by: [desc: h.inserted_at],
        limit: 1

    Repo.one(query)
  end

  def get_opening_prices do
    {:ok, zero_time} = Time.new(0, 0, 0)
    {:ok, start_datetime} = Date.utc_today() |> NaiveDateTime.new(zero_time)
    {:ok, end_datetime} = Date.utc_today() |> Date.add(1) |> NaiveDateTime.new(zero_time)

    query =
      from h in BitmexHistory,
        join: i in BitmexHistory,
        on: h.symbol == i.symbol,
        where: h.inserted_at >= ^start_datetime,
        where: h.inserted_at <= ^end_datetime,
        where: h.is_testnet == true,
        where: i.is_testnet == false,
        order_by: [asc: [h.inserted_at, i.inserted_at]],
        distinct: [h.symbol],
        select: %{
          symbol: h.symbol,
          opening_test_price: h.price,
          opening_live_price: i.price
        }

    Repo.all(query)
  end

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

  def broadcast_acc_update(%BitmexAcc{} = acc) do
    acc_data =
      bitmex_acc_with_latest_historical_data_query()
      |> where([a], a.id == ^acc.id)
      |> Repo.one()

    Endpoint.broadcast("bitmex_accs:#{acc.user_id}", "acc_update", %{acc: acc_data})
  end

  def bitmex_acc_with_latest_historical_data_query do
    {:ok, start_datetime} = Date.utc_today() |> Date.add(-30) |> NaiveDateTime.new(~T[00:00:00])

    query =
      from h in HistoricalDatum,
        where: h.inserted_at >= ^start_datetime,
        order_by: h.inserted_at,
        distinct: fragment("date(?)", h.inserted_at)

    from a in BitmexAcc,
      preload: [historical_data: ^query]
  end
end
