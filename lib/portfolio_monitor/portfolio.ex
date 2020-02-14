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
  alias ExBitmex.Rest.User.Margin
  alias ExBitmex.Rest.Position

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
        distinct: h.is_testnet

    Repo.all(query)
    |> organize_price_type
  end

  def get_current_opening_price do
    {:ok, zero_time} = Time.new(0, 0, 0)
    {:ok, start_datetime} = Date.utc_today() |> NaiveDateTime.new(zero_time)
    {:ok, end_datetime} = Date.utc_today() |> Date.add(1) |> NaiveDateTime.new(zero_time)

    query =
      from h in BitmexHistory,
        where: h.inserted_at >= ^start_datetime,
        where: h.inserted_at <= ^end_datetime,
        order_by: [asc: h.inserted_at],
        distinct: h.is_testnet

    Repo.all(query)
    |> organize_price_type
  end

  def create_historical_datum(%BitmexAcc{} = acc, attrs \\ %{}) do
    acc
    |> Ecto.build_assoc(:historical_data, %{})
    |> HistoricalDatum.changeset(attrs)
    |> Repo.insert()
  end

  def record_current_btc_price do
    params = %{symbol: "XBTUSD", count: 1, reverse: true}

    with {:ok, trades, _rate_limit} <- ExBitmex.Rest.Trade.Index.get(params, true) do
      %{price: price} = hd(trades)
      create_bitmex_history(%{btc_price: price, is_testnet: true})
    end

    with {:ok, trades, _rate_limit} <- ExBitmex.Rest.Trade.Index.get(params, false) do
      %{price: price} = hd(trades)
      create_bitmex_history(%{btc_price: price, is_testnet: false})
    end
  end

  def create_bitmex_history(changes) do
    %BitmexHistory{}
    |> BitmexHistory.changeset(changes)
    |> Repo.insert()
  end

  def record_wallet_balances do
    prices = get_last_bitmex_history()

    Task.Supervisor.start_link(name: :record_wallet_balances_supervisor)

    Task.Supervisor.async_stream_nolink(
      :record_wallet_balances_supervisor,
      list_bitmex_accs(),
      &record_wallet_balance(&1, prices),
      max_concurrency: 5
    )
    |> Enum.to_list()
  end

  def record_wallet_balance(%BitmexAcc{id: id, detected_invalid: true}, _) do
    Logger.warn("Skipping hourly update for acc:#{id} due to invalid credentials")
  end

  def record_wallet_balance(%BitmexAcc{} = acc, {real_price, test_price}) do
    btc_price =
      case acc.is_testnet do
        true -> test_price
        false -> real_price
      end

    credentials = %ExBitmex.Credentials{
      api_key: acc.api_key,
      api_secret: acc.api_secret
    }

    params = %{currency: "XBt"}

    with {:ok, margin_resp, _} <- Margin.get(credentials, params, acc.is_testnet),
         {:ok, position_resp, _} <- Position.Index.get(credentials, params, acc.is_testnet) do
      avg_entry_price =
        case Enum.at(position_resp, 0) do
          nil -> 0
          position_data -> Map.get(position_data, :avg_entry_price)
        end

      changes =
        margin_resp
        |> Map.take([:wallet_balance, :margin_balance])
        |> Map.put(:btc_price, btc_price)
        |> Map.put(:avg_entry_price, avg_entry_price)

      create_historical_datum(acc, changes)
      broadcast_acc_update(acc)
    else
      {:error, {:unauthorized, _}, _} ->
        update_bitmex_acc(acc, %{detected_invalid: true})
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
      Date.utc_today() |> Date.add(-diff) |> NaiveDateTime.new(Time.utc_now())

    from h in HistoricalDatum,
      where: h.inserted_at >= ^target_datetime,
      order_by: h.inserted_at,
      distinct: h.bitmex_acc_id
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
        wallet_balance_now: h.wallet_balance,
        avg_entry_price: h.avg_entry_price
      }
  end

  defp organize_price_type(bitmex_history) do
    [first, second] = bitmex_history

    test_price = if first.is_testnet == true, do: first.btc_price, else: second.btc_price
    real_price = if first.is_testnet == false, do: first.btc_price, else: second.btc_price

    {real_price, test_price}
  end
end
