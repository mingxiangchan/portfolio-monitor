defmodule PortfolioMonitor.Account.BitmexAcc do
  use Ecto.Schema
  import Ecto.Changeset

  schema "bitmex_accs" do
    field :api_key, :string
    field :api_secret, :string

    timestamps()
  end

  @doc false
  def changeset(bitmex_acc, attrs) do
    bitmex_acc
    |> cast(attrs, [:api_key, :api_secret])
    |> validate_required([:api_key, :api_secret])
  end
end
