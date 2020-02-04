defmodule PortfolioMonitor.Repo.Migrations.RemoveUnusedTables do
  use Ecto.Migration

  def change do
    drop table("margins")
    drop table("positions")
    drop table("order_details")
    drop table("experiments")

    alter table("bitmex_accs") do
      remove(:wallet_balance)
      remove(:available_margin)
    end
  end
end
