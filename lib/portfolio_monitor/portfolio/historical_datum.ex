defmodule PortfolioMonitor.Portfolio.HistoricalDatum do
  use Ecto.Schema
  import Ecto.Changeset

  schema "historical_data" do
    field :wallet_balance, :integer
    field :margin_balance, :integer
    field :btc_price, :decimal
    belongs_to :bitmex_acc, PortfolioMonitor.Account.BitmexAcc

    timestamps()
  end

  @doc false
  def changeset(historical_datum, attrs) do
    historical_datum
    |> cast(attrs, [:wallet_balance, :margin_balance, :btc_price])
    |> validate_required([:wallet_balance, :margin_balance, :btc_price])
  end
end

defimpl Jason.Encoder, for: PortfolioMonitor.Portfolio.HistoricalDatum do
  alias Decimal, as: D

  def encode(row, opts) do
    wallet_balance_usd =
      row.wallet_balance
      # convert from satoshis to BTC
      |> D.div(100_000_000)
      |> D.mult(row.wallet_balance)
      # convert from USD to USD cents
      |> D.mult(100)
      |> D.round(0, :down)
      |> D.to_integer()

    historical_datum = %{
      id: row.id,
      wallet_balance_btc: row.wallet_balance,
      wallet_balance_usd: wallet_balance_usd,
      btc_price: row.btc_price
    }

    Jason.Encode.map(historical_datum, opts)
  end
end
