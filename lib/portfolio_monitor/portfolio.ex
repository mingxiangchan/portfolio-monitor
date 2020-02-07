defmodule PortfolioMonitor.Portfolio do
  @moduledoc """
  The Portfolio context.
  """

  import Ecto.Query, warn: false
  alias PortfolioMonitor.Repo
  alias PortfolioMonitor.Account

  alias PortfolioMonitor.Portfolio.HistoricalDatum
  alias PortfolioMonitor.Portfolio.BitmexHistory
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

  def create_historical_datum(%Account.BitmexAcc{} = acc, attrs \\ %{}) do
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

    Account.list_bitmex_accs()
    |> Enum.each(&record_wallet_balance(&1, btc_price))
  end

  def record_wallet_balance(%Account.BitmexAcc{} = acc, btc_price) do
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
      Account.broadcast_acc_update(acc)
    end
  end

  def with_historical_balance(query) do
    d1_query = oldest_historical_datum_within_days(1)
    d7_query = oldest_historical_datum_within_days(7)
    d30_query = oldest_historical_datum_within_days(30)

    from a in query,
      join: b in subquery(d1_query),
      on: a.id == b.bitmex_acc_id,
      join: c in subquery(d7_query),
      on: a.id == c.bitmex_acc_id,
      join: d in subquery(d30_query),
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
end

# Account.bitmex_acc_with_latest_historical_data_query |> where([a], a.id == 1) |> Portfolio.with_historical_balance |> Repo.all
