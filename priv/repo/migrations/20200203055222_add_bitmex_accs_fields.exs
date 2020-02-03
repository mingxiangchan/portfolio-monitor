defmodule PortfolioMonitor.Repo.Migrations.AddBitmexAccsFields do
  use Ecto.Migration

  def change do
    alter table("bitmex_accs") do
      add :deposit_usd, :integer
      add :deposit_btc, :integer
      add :notes, :text
    end
  end
end
