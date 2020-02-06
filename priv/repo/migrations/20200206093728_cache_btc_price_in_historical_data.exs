defmodule PortfolioMonitor.Repo.Migrations.CacheBtcPriceInHistoricalData do
  use Ecto.Migration

  def change do
    alter table(:historical_data) do
      add(:btc_price, :numeric)
    end
  end
end
