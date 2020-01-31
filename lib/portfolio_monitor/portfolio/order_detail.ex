defmodule PortfolioMonitor.Portfolio.OrderDetail do
  use Ecto.Schema
  import Ecto.Changeset

  schema "order_details" do
    field :data, :map
    belongs_to :bitmex_acc, PortfolioMonitor.Account.BitmexAcc

    timestamps()
  end

  @doc false
  def changeset(order_detail, attrs) do
    order_detail
    |> cast(attrs, [:data, :bitmex_acc_id])
    |> validate_required([:data, :bitmex_acc_id])
  end
end
