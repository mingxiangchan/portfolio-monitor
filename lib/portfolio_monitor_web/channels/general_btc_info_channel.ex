defmodule PortfolioMonitorWeb.GeneralBtcInfoChannel do
  use PortfolioMonitorWeb, :channel
  require Logger

  alias PortfolioMonitorWeb.Endpoint

  def join("general_btc_info", _payload, socket) do
    {:ok, socket}
  end

  def handle_in("get_opening_price", _, socket) do
    history = PortfolioMonitor.Portfolio.get_last_bitmex_history()
    {:reply, {:ok, %{opening_price: history.btc_price}}, socket}
  end
end
