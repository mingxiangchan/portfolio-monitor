defmodule PortfolioMonitor.Portfolio.HistoricalDatum do
  use Ecto.Schema
  import Ecto.Changeset

  schema "historical_data" do
    field :btc_price, :integer
    field :wallet_balance, :integer

    timestamps()
  end

  @doc false
  def changeset(historical_datum, attrs) do
    historical_datum
    |> cast(attrs, [:wallet_balance, :btc_price])
    |> validate_required([:wallet_balance, :btc_price])
  end
end
