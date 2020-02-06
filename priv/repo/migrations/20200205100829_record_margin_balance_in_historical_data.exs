defmodule PortfolioMonitor.Repo.Migrations.RecordMarginBalanceInHistoricalData do
  use Ecto.Migration

  def change do
    alter table(:historical_data) do
      add(:margin_balance, :bigint)
    end
  end
end
