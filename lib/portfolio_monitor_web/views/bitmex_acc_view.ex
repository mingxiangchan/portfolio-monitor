defmodule PortfolioMonitorWeb.BitmexAccView do
  use PortfolioMonitorWeb, :view
  alias PortfolioMonitorWeb.BitmexAccView

  def render("index.json", %{bitmex_accs: bitmex_accs}) do
    %{data: render_many(bitmex_accs, BitmexAccView, "bitmex_acc.json")}
  end

  def render("show.json", %{bitmex_acc: bitmex_acc}) do
    %{data: render_one(bitmex_acc, BitmexAccView, "bitmex_acc.json")}
  end

  def render("bitmex_acc.json", %{bitmex_acc: bitmex_acc}) do
    %{
      id: bitmex_acc.id,
      name: bitmex_acc.name,
      depositUsd: bitmex_acc.deposit_btc,
      depositBtc: bitmex_acc.deposit_btc,
      notes: bitmex_acc.notes
    }
  end
end
