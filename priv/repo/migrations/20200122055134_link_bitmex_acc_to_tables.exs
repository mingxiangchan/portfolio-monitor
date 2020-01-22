defmodule PortfolioMonitor.Repo.Migrations.LinkBitmexAccToTables do
  use Ecto.Migration

  def change do
    alter table(:margins) do
      add(:bitmex_acc_id, references(:bitmex_accs))
    end

    alter table(:positions) do
      add(:bitmex_acc_id, references(:bitmex_accs))
    end

    alter table(:order_details) do
      add(:bitmex_acc_id, references(:bitmex_accs))
    end
  end
end
