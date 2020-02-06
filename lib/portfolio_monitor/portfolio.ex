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
    end
  end
end
