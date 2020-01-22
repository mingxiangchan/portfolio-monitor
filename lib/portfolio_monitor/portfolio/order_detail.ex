defmodule PortfolioMonitor.Portfolio.OrderDetail do
  use Ecto.Schema
  import Ecto.Changeset

  schema "order_details" do
    field :data, {:array, :map}

    timestamps()
  end

  @doc false
  def changeset(order_detail, attrs) do
    order_detail
    |> cast(attrs, [:data])
    |> validate_required([:data])
  end
end
