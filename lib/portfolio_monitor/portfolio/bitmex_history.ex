defmodule PortfolioMonitor.Portfolio.BitmexHistory do
  use Ecto.Schema
  import Ecto.Changeset

  schema "bitmex_history" do
    field :btc_price, :decimal
    field :is_testnet, :boolean

    timestamps()
  end

  @doc false
  def changeset(bitmex_history, attrs) do
    bitmex_history
    |> cast(attrs, [:btc_price, :is_testnet])
    |> validate_required([:btc_price, :is_testnet])
  end
end
