defmodule PortfolioMonitor.Repo.Migrations.CreateMargins do
  use Ecto.Migration

  def change do
    create table(:margins) do
      add :data, :map

      timestamps()
    end

  end
end
