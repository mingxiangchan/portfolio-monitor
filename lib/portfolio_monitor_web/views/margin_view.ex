defmodule PortfolioMonitorWeb.MarginView do
  use PortfolioMonitorWeb, :view
  alias PortfolioMonitorWeb.MarginView

  def render("index.json", %{margins: margins}) do
    %{data: render_many(margins, MarginView, "margin.json")}
  end

  def render("show.json", %{margin: margin}) do
    %{data: render_one(margin, MarginView, "margin.json")}
  end

  def render("margin.json", %{margin: margin}) do
    %{id: margin.id,
      data: margin.data}
  end
end
