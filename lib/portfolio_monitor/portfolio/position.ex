defmodule PortfolioMonitor.Portfolio.Position do
  use Ecto.Schema
  import Ecto.Changeset

  schema "positions" do
    field :data, {:array, :map}
    belongs_to :bitmex_acc, PortfolioMonitor.Account.BitmexAcc

    timestamps()
  end

  @doc false
  def changeset(position, attrs) do
    position
    |> cast(attrs, [:data, :bitmex_acc_id])
    |> validate_required([:data, :bitmex_acc_id])
  end
end
