defmodule PortfolioMonitorWeb.BitmexAccView do
  use PortfolioMonitorWeb, :view
  alias PortfolioMonitorWeb.BitmexAccView

  def render("index.json", %{bitmex_accs: bitmex_accs}) do
    %{data: render_many(bitmex_accs, BitmexAccView, "bitmex_acc.json")}
  end

  def render("bitmex_acc.json", %{bitmex_acc: bitmex_acc}) do
    %{id: bitmex_acc.id,
      name: bitmex_acc.name
    }
  end
end
