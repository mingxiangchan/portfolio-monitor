defmodule PortfolioMonitor.Repo.Migrations.ChangeBtcPriceToPrice do
  use Ecto.Migration

  def change do
    rename table(:bitmex_history), :btc_price, to: :price

    alter table(:bitmex_history) do
      add :symbol, :string, null: false, default: "XBTUSD"
    end
  end
end
