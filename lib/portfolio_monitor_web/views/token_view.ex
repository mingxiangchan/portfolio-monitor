defmodule PortfolioMonitorWeb.TokenView do
  use PortfolioMonitorWeb, :view

  def render("show.json", %{token: token}) do
    %{token: token}
  end
end
