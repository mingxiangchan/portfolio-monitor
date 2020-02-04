defmodule PortfolioMonitorWeb.BitmexAccView do
  use PortfolioMonitorWeb, :view
  alias PortfolioMonitorWeb.BitmexAccView

  def render("index.json", %{bitmex_accs: bitmex_accs}) do
    %{data: render_many(bitmex_accs, BitmexAccView, "bitmex_acc.json")}
  end

  def render("bitmex_acc.json", %{bitmex_acc: bitmex_acc}) do
    %{
      id: bitmex_acc.id,
      name: bitmex_acc.name,
      deposit_usd: bitmex_acc.deposit_usd,
      deposit_btc: bitmex_acc.deposit_btc,
      notes: bitmex_acc.notes
    }
  end

  def render("error.json", %{message: message}) do
    %{message: message}
  end

  def render("success.json", %{action: action}) do
    %{
      message: "Success",
      action: action
    }
  end
end
