defmodule PortfolioMonitor.Repo.Migrations.CreateBitmexAccs do
  use Ecto.Migration

  def change do
    create table(:bitmex_accs) do
      add :api_key, :text
      add :api_secret, :text

      timestamps()
    end

  end
end
