defmodule PortfolioMonitor.Account.BitmexAcc do
  use Ecto.Schema
  import Ecto.Changeset
  alias PortfolioMonitor.CustomFields.Encrypted

  alias PortfolioMonitor.Portfolio.{Margin, Position, OrderDetail}

  schema "bitmex_accs" do
    field :api_key, Encrypted
    field :api_secret, Encrypted
    has_many :margins, Margin
    has_many :positions, Position
    has_many :order_details, OrderDetail
    timestamps()
  end

  @doc false
  def changeset(bitmex_acc, attrs) do
    bitmex_acc
    |> cast(attrs, [:api_key, :api_secret])
    |> validate_required([:api_key, :api_secret])
  end
end
