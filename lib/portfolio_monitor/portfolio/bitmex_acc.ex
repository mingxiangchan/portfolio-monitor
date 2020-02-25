defmodule PortfolioMonitor.Portfolio.BitmexAcc do
  use Ecto.Schema
  import Ecto.Changeset
  alias PortfolioMonitor.CustomFields.Encrypted

  schema "bitmex_accs" do
    field :api_key, Encrypted
    field :api_secret, Encrypted
    field :name, :string
    field :deposit_usd, :integer
    field :deposit_btc, :integer
    field :notes, :string
    field :detected_invalid, :boolean
    field :is_testnet, :boolean

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

defimpl Jason.Encoder, for: PortfolioMonitor.Portfolio.BitmexAcc do
  alias Decimal, as: D
  alias PortfolioMonitor.Portfolio.HistoricalDatum

  @unformatted_fields [
    :id,
    :name,
    :notes,
    :deposit_usd,
    :detected_invalid,
    :is_testnet,
    :avg_entry_price
  ]

  @formatted_fields [
    :deposit_btc,
    :margin_balance
  ]

  def encode(row, opts) do
    formatted_data =
      row
      |> Map.take(@formatted_fields)
      |> Enum.map(fn {k, v} ->
        if is_nil(v), do: {k, v}, else: {k, D.div(v, 100_000_000)}
      end)
      |> Enum.into(%{})

    historical_data = initial_history(row) ++ row.historical_data

    row
    |> Map.take(@unformatted_fields)
    |> Map.merge(formatted_data)
    |> Map.put(:historical_data, historical_data)
    |> Jason.Encode.map(opts)
  end

  def initial_history(%{deposit_usd: 0} = row), do: placeholder_initial_history(row)
  def initial_history(%{deposit_btc: 0} = row), do: placeholder_initial_history(row)

  def initial_history(row) do
    initial_btc_price =
      row.deposit_usd
      |> D.div(row.deposit_btc)
      |> D.mult(100_000_000)
      |> D.div(100)

    [
      %HistoricalDatum{
        wallet_balance: row.deposit_btc,
        margin_balance: row.deposit_btc,
        btc_price: initial_btc_price,
        avg_entry_price: initial_btc_price,
        inserted_at: row.inserted_at
      }
    ]
  end

  def placeholder_initial_history(row) do
    [
      %HistoricalDatum{
        wallet_balance: 0,
        margin_balance: 0,
        btc_price: 0,
        avg_entry_price: 0,
        inserted_at: row.inserted_at
      }
    ]
  end
end
