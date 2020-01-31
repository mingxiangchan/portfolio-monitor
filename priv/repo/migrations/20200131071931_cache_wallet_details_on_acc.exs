defmodule PortfolioMonitor.Repo.Migrations.CacheWalletDetailsOnAcc do
  use Ecto.Migration

  def change do
    alter table(:bitmex_accs) do
      add(:wallet_balance, :integer)
      add(:available_margin, :integer)
    end
  end
end
