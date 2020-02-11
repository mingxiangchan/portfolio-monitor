defmodule PortfolioMonitor.Repo.Migrations.AddDetectedInvalidToBitmexAccs do
  use Ecto.Migration

  def change do
    alter table(:bitmex_accs) do
      add(:detected_invalid, :boolean, default: false, null: false)
    end

    create(index(:bitmex_accs, :detected_invalid))
  end
end
