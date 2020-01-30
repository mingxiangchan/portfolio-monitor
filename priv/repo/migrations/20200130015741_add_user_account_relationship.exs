defmodule PortfolioMonitor.Repo.Migrations.AddUserAccountRelationship do
  use Ecto.Migration

  def change do
    alter table(:bitmex_accs) do
      add(:user_id, references(:users))
    end
  end
end
