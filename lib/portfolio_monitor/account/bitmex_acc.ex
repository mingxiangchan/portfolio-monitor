defmodule PortfolioMonitor.Account.BitmexAcc do
  use Ecto.Schema
  import Ecto.Changeset
  alias PortfolioMonitor.CustomFields.Encrypted

  @derive {Jason.Encoder,
           only: [
             :id,
             :name,
             :notes,
             :deposit_usd,
             :deposit_btc,
             :margin_balance,
             :wallet_balance_now,
             :historical_data
           ]}
  schema "bitmex_accs" do
    field :api_key, Encrypted
    field :api_secret, Encrypted
    field :name, :string
    field :deposit_usd, :integer
    field :deposit_btc, :integer
    field :notes, :string
    field :margin_balance, :integer, virtual: true
    field :wallet_balance_now, :integer, virtual: true
    belongs_to :user, PortfolioMonitor.Account.User
    has_many :historical_data, PortfolioMonitor.Portfolio.HistoricalDatum

    timestamps()
  end

  @doc false
  def changeset(bitmex_acc, attrs) do
    bitmex_acc
    |> cast(attrs, [:api_key, :api_secret, :name, :user_id, :deposit_usd, :deposit_btc, :notes])
    |> validate_required([:api_key, :api_secret, :name, :user_id, :deposit_usd, :deposit_btc])
  end
end
