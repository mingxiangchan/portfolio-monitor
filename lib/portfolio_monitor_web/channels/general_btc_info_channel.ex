defmodule PortfolioMonitorWeb.GeneralBtcInfoChannel do
  use PortfolioMonitorWeb, :channel
  require Logger

  alias PortfolioMonitorWeb.Endpoint

  def join("general_btc_info", _payload, socket) do
    Task.start(fn ->
      :timer.sleep(2)
      broadcast_opening_price()
    end)

    {:ok, socket}
  end

  def broadcast_opening_price do
    history = PortfolioMonitor.Portfolio.get_last_bitmex_history()

    Endpoint.broadcast("general_btc_info", "opening_price", %{
      openingPrice: history.btc_price
    })
  end
end
