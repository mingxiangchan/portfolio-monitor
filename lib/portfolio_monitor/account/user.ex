defmodule PortfolioMonitor.Account.User do
  use Ecto.Schema
  use Pow.Ecto.Schema
  use Pow.Extension.Ecto.Schema,
    extensions: [PowPersistentSession]
  alias PortfolioMonitor.Portfolio.BitmexAcc

  schema "users" do
    pow_user_fields()
    has_many :bitmex_accs, BitmexAcc

    timestamps()
  end
end
