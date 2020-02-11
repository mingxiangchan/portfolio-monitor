defmodule PortfolioMonitor.Portfolio do
  @moduledoc """
  The Portfolio context.
  """

  import Ecto.Query, warn: false
  alias PortfolioMonitor.Repo
  alias PortfolioMonitor.Account.User
  alias PortfolioMonitor.Portfolio.HistoricalDatum
  alias PortfolioMonitor.Portfolio.BitmexHistory
  alias PortfolioMonitor.Portfolio.BitmexAcc
  alias PortfolioMonitorWeb.Endpoint
  alias ExBitmex.Rest.User.Margin

  def list_historical_data do
    Repo.all(HistoricalDatum)
  end

  def bitmex_acc_historical_data(bitmex_acc) do
    query =
      from h in HistoricalDatum,
        where: h.bitmex_acc_id == ^bitmex_acc.id,
        order_by: h.inserted_at

    Repo.all(query)
  end

  def get_last_bitmex_history do
    query =
      from h in BitmexHistory,
        order_by: [desc: h.inserted_at],
        limit: 1

    Repo.one(query)
  end

  def create_historical_datum(%BitmexAcc{} = acc, attrs \\ %{}) do
    acc
    |> Ecto.build_assoc(:historical_data, %{})
    |> HistoricalDatum.changeset(attrs)
    |> Repo.insert()
  end

  def record_current_btc_price do
    params = %{symbol: "XBTUSD", count: 1, reverse: true}

    with {:ok, trades, _rate_limit} <- ExBitmex.Rest.Trade.Index.get(params) do
      %{price: price} = hd(trades)
      create_bitmex_history(%{btc_price: price})
    end
  end

  def create_bitmex_history(changes) do
    %BitmexHistory{}
    |> BitmexHistory.changeset(changes)
    |> Repo.insert()
  end

  def record_wallet_balances do
    btc_price = get_last_bitmex_history().btc_price

    list_bitmex_accs()
    |> Enum.each(&record_wallet_balance(&1, btc_price))
  end

  def record_wallet_balance(%BitmexAcc{} = acc, btc_price) do
    credentials = %ExBitmex.Credentials{
      api_key: acc.api_key,
      api_secret: acc.api_secret
    }

    params = %{currency: "XBt"}

    with {:ok, resp, _} <- Margin.get(credentials, params) do
      changes =
        resp
        |> Map.take([:wallet_balance, :margin_balance])
        |> Map.put(:btc_price, btc_price)

      create_historical_datum(acc, changes)
      broadcast_acc_update(acc)
    end
  end

  def with_historical_balance(query) do
    d1_query = oldest_historical_datum_within_days(1)
    d7_query = oldest_historical_datum_within_days(7)
    d30_query = oldest_historical_datum_within_days(30)

    from a in query,
      left_join: b in subquery(d1_query),
      on: a.id == b.bitmex_acc_id,
      left_join: c in subquery(d7_query),
      on: a.id == c.bitmex_acc_id,
      left_join: d in subquery(d30_query),
      on: a.id == d.bitmex_acc_id,
      select_merge: %{
        wallet_balance_1_day: b.wallet_balance,
        wallet_balance_7_days: c.wallet_balance,
        wallet_balance_30_days: d.wallet_balance
      }
  end

  defp oldest_historical_datum_within_days(diff) do
    {:ok, target_datetime} =
      Date.utc_today()
      |> Date.add(-diff)
      |> NaiveDateTime.new(Time.utc_now())

    from h in HistoricalDatum,
      where: h.inserted_at >= ^target_datetime,
      order_by: h.inserted_at,
      limit: 1
  end

  def list_bitmex_accs do
    Repo.all(BitmexAcc)
  end

  def list_bitmex_accs(%User{} = user, :with_details) do
    bitmex_acc_with_latest_historical_data_query()
    |> with_historical_balance()
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
      |> with_historical_balance()
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
    from h in HistoricalDatum, order_by: [desc: h.inserted_at]
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
