defmodule PortfolioMonitor.Repo.Migrations.CreateOrderDetails do
  use Ecto.Migration

  def change do
    create table(:order_details) do
      add :data, :map

      timestamps()
    end

  end
end
