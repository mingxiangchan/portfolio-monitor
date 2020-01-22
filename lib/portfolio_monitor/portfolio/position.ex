defmodule PortfolioMonitor.Portfolio.Position do
  use Ecto.Schema
  import Ecto.Changeset

  schema "positions" do
    field :data, {:array, :map}

    timestamps()
  end

  @doc false
  def changeset(position, attrs) do
    position
    |> cast(attrs, [:data])
    |> validate_required([:data])
  end
end
