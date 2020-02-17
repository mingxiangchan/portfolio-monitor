defmodule PortfolioMonitor.Portfolio.BitmexAcc do
  use Ecto.Schema
  import Ecto.Changeset
  alias PortfolioMonitor.CustomFields.Encrypted

  @derive {Jason.Encoder,
           only: [
             :id,
             :name,
             :notes,
             :detected_invalid,
             :deposit_usd,
             :deposit_btc,
             :margin_balance,
             :wallet_balance_now,
             :wallet_balance_1_day,
             :wallet_balance_7_days,
             :wallet_balance_30_days,
             :historical_data,
             :is_testnet,
             :avg_entry_price
           ]}
  schema "bitmex_accs" do
    field :api_key, Encrypted
    field :api_secret, Encrypted
    field :name, :string
    field :deposit_usd, :integer
    field :deposit_btc, :integer
    field :notes, :string
    field :detected_invalid, :boolean
    field :is_testnet, :boolean
    field :margin_balance, :integer, virtual: true
    field :wallet_balance_now, :integer, virtual: true
    field :wallet_balance_1_day, :integer, virtual: true
    field :wallet_balance_7_days, :integer, virtual: true
    field :wallet_balance_30_days, :integer, virtual: true
    field :avg_entry_price, :decimal, virtual: true

    belongs_to :user, PortfolioMonitor.Account.User
    has_many :historical_data, PortfolioMonitor.Portfolio.HistoricalDatum, on_delete: :delete_all

    timestamps()
  end

  @required_fields [
    :api_key,
    :api_secret,
    :name,
    :user_id,
    :deposit_usd,
    :deposit_btc,
    :detected_invalid,
    :is_testnet
  ]

  @non_required_fields [
    :notes
  ]

  @doc false
  def changeset(bitmex_acc, attrs) do
    bitmex_acc
    |> cast(attrs, @required_fields ++ @non_required_fields)
    |> check_api_creds_update
    |> validate_required(@required_fields)
  end

  def check_api_creds_update(changeset) do
    case changeset do
      %{changes: %{api_key: _, api_secret: _}} -> put_change(changeset, :detected_invalid, false)
      _ -> changeset
    end
  end
end
