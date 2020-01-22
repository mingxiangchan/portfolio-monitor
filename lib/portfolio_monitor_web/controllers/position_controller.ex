defmodule PortfolioMonitorWeb.PositionController do
  use PortfolioMonitorWeb, :controller

  alias PortfolioMonitor.Portfolio

  action_fallback PortfolioMonitorWeb.FallbackController

  def index(conn, _params) do
    positions = Portfolio.list_positions()
    render(conn, "index.json", positions: positions)
  end
end
