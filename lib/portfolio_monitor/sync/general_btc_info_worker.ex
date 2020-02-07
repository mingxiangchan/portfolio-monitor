defmodule PortfolioMonitor.Sync.GeneralBtcInfoWorker do
  alias PortfolioMonitorWeb.Endpoint
  use ExBitmex.WebSocket

  def handle_response(json, _state) do
    Task.start(fn ->
      persist_response(json)
    end)
  end

  def persist_response(data) do
    Endpoint.broadcast("general_btc_info", "price", %{"data" => data})
  end
end
