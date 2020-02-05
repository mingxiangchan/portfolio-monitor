defmodule PortfolioMonitor.Portfolio.BitmexHistory do
  use Ecto.Schema
  import Ecto.Changeset

  schema "bitmex_history" do
    field :btc_price, :decimal

    timestamps()
  end

  @doc false
  def changeset(bitmex_history, attrs) do
    bitmex_history
    |> cast(attrs, [:btc_price])
    |> validate_required([:btc_price])
  end
end
