defmodule PortfolioMonitor.Portfolio.BitmexHistory do
  use Ecto.Schema
  import Ecto.Changeset

  schema "bitmex_history" do
    field :price, :decimal
    field :is_testnet, :boolean
    field :symbol, :string

    timestamps()
  end

  @doc false
  def changeset(bitmex_history, attrs) do
    bitmex_history
    |> cast(attrs, [:price, :is_testnet, :symbol])
    |> validate_required([:price, :is_testnet, :symbol])
  end
end
