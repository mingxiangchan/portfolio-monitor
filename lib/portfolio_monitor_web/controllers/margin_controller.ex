defmodule PortfolioMonitorWeb.MarginController do
  use PortfolioMonitorWeb, :controller

  alias PortfolioMonitor.Portfolio

  action_fallback PortfolioMonitorWeb.FallbackController

  def index(conn, _params) do
    margins = Portfolio.list_margins()
    render(conn, "index.json", margins: margins)
  end
end
