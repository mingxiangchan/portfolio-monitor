defmodule PortfolioMonitorWeb.GeneralBtcInfoChannel do
  use Appsignal.Instrumentation.Decorators
  use PortfolioMonitorWeb, :channel
  require Logger

  def join("general_btc_info", _payload, socket) do
    {:ok, socket}
  end

  @decorate channel_action()
  def handle_in("get_opening_price", _, socket) do
    {real_price, test_price} = PortfolioMonitor.Portfolio.get_current_opening_price()
    {:reply, {:ok, %{opening_test_price: test_price, opening_real_price: real_price }}, socket}
  end
end
