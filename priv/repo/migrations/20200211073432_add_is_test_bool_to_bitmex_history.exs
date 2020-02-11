defmodule PortfolioMonitor.Repo.Migrations.AddIsTestBoolToBitmexHistory do
  use Ecto.Migration

  def change do
    alter table(:bitmex_history) do
      add(:is_testnet, :bool)
    end
  end
end
