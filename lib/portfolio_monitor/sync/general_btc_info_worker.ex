defmodule PortfolioMonitor.Sync.GeneralBtcInfoWorker do
  alias PortfolioMonitorWeb.Endpoint
  use ExBitmex.WebSocket
  require Logger

  def handle_response(json, %{is_testnet: is_testnet}) do
    Task.start(fn ->
      persist_response(json, is_testnet)
    end)
  end

  def persist_response(data, is_testnet) do
    Logger.info("=====================")
    Logger.info(is_testnet)
    IO.inspect(data)
    Logger.info("=====================")
    event = case is_testnet do
      true -> "testnet_price"
      false -> "livenet_price"
    end
    Endpoint.broadcast("general_btc_info", event, %{"data" => data})
  end
end
