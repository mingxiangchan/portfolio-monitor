defmodule PortfolioMonitor.Repo.Migrations.AddMarginJsonbIndexes do
  use Ecto.Migration

  def up do
    execute("CREATE INDEX margins_available_margin ON margins((data->>'availableMargin'));")
    execute("CREATE INDEX margins_wallet_balance ON margins((data->>'walletBalance'));")
  end

  def down do
    execute("DROP INDEX margins_available_margin;")
    execute("DROP INDEX margins_wallet_balance;")
  end
end
