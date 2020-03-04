defmodule PortfolioMonitor.Sync.Worker do
  alias PortfolioMonitorWeb.Endpoint
  alias PortfolioMonitor.Portfolio
  use ExBitmex.WebSocketOverride

  def handle_response(json, state) do
    # spawn async, no-link process to perform db insert
    # it is acceptable to lose inserts
    updated_state = persist_response(json, state)

    {:ok, updated_state}
  end

  def persist_response(%{"table" => table, "data" => data}, state) do
    %{user_id: user_id, acc_id: acc_id} = state

    Task.start(fn ->
      Endpoint.broadcast("bitmex_accs:#{user_id}", "ws_#{table}", %{
        "data" => data,
        "acc_id" => acc_id
      })
    end)

    results =
      data
      |> Enum.reduce(%{}, fn item, acc ->
        relevant_fields = Map.take(item, ~w[walletBalance marginBalance avgEntryPrice])
        Map.merge(acc, relevant_fields)
      end)
      |> Map.new(fn {k, v} -> {String.to_atom(k), v} end)

    Map.merge(state, results)
  end

  def persist_response(_, state), do: state

  # pid = Process.whereis(:"BitMexAccWorker.1")
  # send(pid, :record_acc_info)
  @impl true
  def handle_info(:record_acc_info, state) do
    # handle in task so crashes don't affect the current ws process
    Task.start(fn ->
      btc_price =
        state[:is_testnet]
        |> Portfolio.get_latest_price()
        |> Map.get(:price)

      changes = %{
        bitmex_acc_id: state[:acc_id],
        wallet_balance: state[:walletBalance],
        margin_balance: state[:marginBalance],
        avg_entry_price: state[:avgEntryPrice],
        btc_price: btc_price
      }

      Portfolio.create_historical_datum(changes)
    end)

    {:ok, state}
  end

  @impl true
  def handle_info(error, state) do
    output_error(error, state, "received unexpected message")
    {:ok, state}
  end

  @impl true
  def handle_disconnect(disconnect_map, state) do
    :ok = Logger.warn("#{__MODULE__} disconnected: #{inspect(disconnect_map)}")

    case Map.get(state, :prevent_reconnect) do
      true ->
        Logger.info("Terminating WS due to invalid credentials")
        acc = Portfolio.get_bitmex_acc(state[:acc_id])
        Portfolio.update_bitmex_acc(acc, %{detected_invalid: true})
        {:ok, state}

      nil ->
        :timer.sleep(3000)
        {:reconnect, state}
    end
  end
end
