defmodule PortfolioMonitor.Sync.Worker do
  alias PortfolioMonitorWeb.Endpoint
  use ExBitmex.WebSocketOverride

  def handle_response(json, state) do
    # spawn async, no-link process to perform db insert
    # it is acceptable to lose inserts
    Task.start(fn ->
      persist_response(json, Map.take(state, [:acc_id, :user_id]))
    end)

    {:ok, state}
  end

  def persist_response(%{"action" => "partial"}, _), do: Logger.warn("ignoring partial")

  def persist_response(%{"table" => table, "data" => data}, state) do
    %{user_id: user_id, acc_id: acc_id} = state

    Endpoint.broadcast("bitmex_accs:#{user_id}", "ws_#{table}", %{
      "data" => data,
      "acc_id" => acc_id
    })
  end

  def persist_response(_, _), do: nil

  def handle_disconnect(disconnect_map, state) do
    :ok = Logger.warn("#{__MODULE__} disconnected: #{inspect(disconnect_map)}")
    :timer.sleep(3000)
    {:reconnect, state}
  end
end
