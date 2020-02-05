defmodule PortfolioMonitor.Repo.Migrations.ChangeColTypesForWalletBalances do
  use Ecto.Migration

  def change do
    alter table(:bitmex_accs) do
      modify(:deposit_btc, :bigint)
    end

    alter table(:historical_data) do
      modify(:wallet_balance, :bigint)
    end
  end
end
