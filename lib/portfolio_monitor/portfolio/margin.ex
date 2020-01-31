defmodule PortfolioMonitor.Portfolio.Margin do
  use Ecto.Schema
  import Ecto.Changeset

  schema "margins" do
    field :data, :map
    belongs_to :bitmex_acc, PortfolioMonitor.Account.BitmexAcc

    timestamps()
  end

  @doc false
  def changeset(margin, attrs) do
    margin
    |> cast(attrs, [:data, :bitmex_acc_id])
    |> validate_required([:data, :bitmex_acc_id])
  end
end
