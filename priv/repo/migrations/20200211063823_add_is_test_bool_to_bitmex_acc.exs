defmodule PortfolioMonitor.Repo.Migrations.AddIsTestBoolToBitmexAcc do
  use Ecto.Migration

  def change do
    alter table(:bitmex_accs) do
      add(:is_testnet, :bool, null: false, default: true)
    end
  end
end
