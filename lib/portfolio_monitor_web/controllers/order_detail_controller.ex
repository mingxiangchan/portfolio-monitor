defmodule PortfolioMonitorWeb.OrderDetailController do
  use PortfolioMonitorWeb, :controller

  alias PortfolioMonitor.Portfolio

  action_fallback PortfolioMonitorWeb.FallbackController

  def index(conn, _params) do
    order_details = Portfolio.list_order_details()
    render(conn, "index.json", order_details: order_details)
  end
end
