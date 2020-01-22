defmodule PortfolioMonitor.Repo.Migrations.CreateExperiments do
  use Ecto.Migration

  def change do
    create table(:experiments) do
      add(:start, :naive_datetime)
      add(:end, :naive_datetime)
      add(:note, :text)
      add(:bitmex_acc_id, references(:bitmex_accs))

      timestamps()
    end
  end
end
