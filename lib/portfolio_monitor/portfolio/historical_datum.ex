defmodule PortfolioMonitor.Portfolio.HistoricalDatum do
  use Ecto.Schema
  import Ecto.Changeset

  schema "historical_data" do
    field :wallet_balance, :integer
    belongs_to :bitmex_acc, PortfolioMonitor.Account.BitmexAcc

    timestamps()
  end

  @doc false
  def changeset(historical_datum, attrs) do
    historical_datum
    |> cast(attrs, [:wallet_balance])
    |> validate_required([:wallet_balance])
  end
end
