defmodule PortfolioMonitor.Users.User do
  use Ecto.Schema
  use Pow.Ecto.Schema
  alias PortfolioMonitor.Account.BitmexAcc

  schema "users" do
    pow_user_fields()
    has_many :bitmex_accs, BitmexAcc

    timestamps()
  end
end
