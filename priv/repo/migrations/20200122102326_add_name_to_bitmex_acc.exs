defmodule PortfolioMonitor.Repo.Migrations.AddNameToBitmexAcc do
  use Ecto.Migration

  def change do
    alter table("bitmex_accs") do
      add :name, :text
    end
  end
end
