defmodule PortfolioMonitor.Repo.Migrations.CreateHistoricalData do
  use Ecto.Migration

  def change do
    create table(:historical_data) do
      add(:wallet_balance, :integer)
      add(:btc_price, :integer)
      add(:bitmex_acc_id, references(:bitmex_accs))

      timestamps()
    end
  end
end
