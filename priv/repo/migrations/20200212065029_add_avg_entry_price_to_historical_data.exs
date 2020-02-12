defmodule PortfolioMonitor.Repo.Migrations.AddAvgEntryPriceToHistoricalData do
  use Ecto.Migration

  def change do
    alter table(:historical_data) do
      add(:avg_entry_price, :numeric, default: 0, null: false)
    end
  end
end
