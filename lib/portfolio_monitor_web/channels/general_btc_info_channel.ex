defmodule PortfolioMonitorWeb.GeneralBtcInfoChannel do
  use Appsignal.Instrumentation.Decorators
  use PortfolioMonitorWeb, :channel
  require Logger
  alias PortfolioMonitor.Portfolio

  def join("general_btc_info", _payload, socket) do
    {:ok, socket}
  end

  @decorate channel_action()
  def handle_in("get_opening_price", _, socket) do
    results = %{
      data: Portfolio.get_opening_prices()
    }

    {:reply, {:ok, results}, socket}
  end
end
