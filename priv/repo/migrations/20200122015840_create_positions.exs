defmodule PortfolioMonitor.Repo.Migrations.CreatePositions do
  use Ecto.Migration

  def change do
    create table(:positions) do
      add :data, :map

      timestamps()
    end

  end
end
