defmodule PortfolioMonitorWeb.OrderDetailView do
  use PortfolioMonitorWeb, :view
  alias PortfolioMonitorWeb.OrderDetailView

  def render("index.json", %{order_details: order_details}) do
    %{data: render_many(order_details, OrderDetailView, "order_detail.json")}
  end

  def render("show.json", %{order_detail: order_detail}) do
    %{data: render_one(order_detail, OrderDetailView, "order_detail.json")}
  end

  def render("order_detail.json", %{order_detail: order_detail}) do
    %{id: order_detail.id,
      data: order_detail.data}
  end
end
