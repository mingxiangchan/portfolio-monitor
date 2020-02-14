defmodule PortfolioMonitor.Repo.Migrations.CascadeAccDeletionToHistoricalData do
  use Ecto.Migration

  def up do
    drop(constraint(:historical_data, :historical_data_bitmex_acc_id_fkey))

    alter table(:historical_data) do
      modify(:bitmex_acc_id, references(:bitmex_accs, on_delete: :delete_all))
    end
  end

  def down do
    drop(constraint(:historical_data, :historical_data_bitmex_acc_id_fkey))

    alter table(:historical_data) do
      modify(:bitmex_acc_id, references(:bitmex_accs))
    end
  end
end
