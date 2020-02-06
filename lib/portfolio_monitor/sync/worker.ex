defmodule PortfolioMonitor.Sync.Worker do
  alias PortfolioMonitor.Portfolio
  alias PortfolioMonitorWeb.Endpoint
  use ExBitmex.WebSocket

  def handle_response(json, state) do
    # spawn async, no-link process to perform db insert
    # it is acceptable to lose inserts
    Task.start(fn ->
      persist_response(json, state[:user_id])
    end)
  end

  def persist_response(%{"action" => "partial"}, _), do: Logger.warn("ignoring partial")

  def persist_response(%{"table" => table, "data" => data}, user_id) do
    Endpoint.broadcast("bitmex_accs:#{user_id}", "ws_#{table}", %{"data" => data})
  end

  def persist_response(_, _), do: nil
end
