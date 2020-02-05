defmodule PortfolioMonitor.Account.BitmexAcc do
  use Ecto.Schema
  import Ecto.Changeset
  alias PortfolioMonitor.CustomFields.Encrypted

  alias PortfolioMonitor.Portfolio.{Margin, Position, OrderDetail, Experiment}

  schema "bitmex_accs" do
    field :api_key, Encrypted
    field :api_secret, Encrypted
    field :name, :string
    field :wallet_balance, :integer
    field :available_margin, :integer
    field :deposit_usd, :integer
    field :deposit_btc, :integer
    field :notes, :string
    has_many :margins, Margin
    has_many :positions, Position
    has_many :order_details, OrderDetail
    has_many :experiments, Experiment
    belongs_to :user, PortfolioMonitor.Account.User
    timestamps()
  end

  @doc false
  def changeset(bitmex_acc, attrs) do
    bitmex_acc
    |> cast(attrs, [
      :api_key,
      :api_secret,
      :name,
      :user_id,
      :available_margin,
      :wallet_balance,
      :deposit_usd,
      :deposit_btc,
      :notes
    ])
    |> validate_required([:api_key, :api_secret, :name, :user_id, :deposit_usd, :deposit_btc])
  end
end
