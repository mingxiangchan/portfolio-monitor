defmodule PortfolioMonitorWeb.GeneralBtcInfoChannel do
  use Appsignal.Instrumentation.Decorators
  use PortfolioMonitorWeb, :channel
  require Logger

  def join("general_btc_info", _payload, socket) do
    {:ok, socket}
  end

  @decorate channel_action()
  def handle_in("get_opening_price", _, socket) do
    history = PortfolioMonitor.Portfolio.get_last_bitmex_history()
    {:reply, {:ok, %{opening_price: history.btc_price}}, socket}
  end
end
