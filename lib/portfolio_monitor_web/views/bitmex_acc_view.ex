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
      current_qty: bitmex_acc.current_qty,
      margin_balance: bitmex_acc.margin_balance,
      liquidation_price: bitmex_acc.liquidation_price,
      unrealized_pnl: bitmex_acc.unrealized_pnl,
      available_margin: bitmex_acc.available_margin,
      wallet_balance: bitmex_acc.wallet_balance,
      realized_pnl: bitmex_acc.realized_pnl,
      home_notional: bitmex_acc.home_notional
    }
  end
end
