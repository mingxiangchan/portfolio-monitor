defmodule PortfolioMonitor.Repo.Migrations.CreateBitmexHistory do
  use Ecto.Migration

  def change do
    alter table(:historical_data) do
      remove(:btc_price)
    end

    create table(:bitmex_history) do
      add(:btc_price, :numeric)

      timestamps()
    end
  end
end
