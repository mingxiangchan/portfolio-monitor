defmodule PortfolioMonitor.Portfolio do
  @moduledoc """
  The Portfolio context.
  """

  import Ecto.Query, warn: false
  alias PortfolioMonitor.Repo
  alias PortfolioMonitor.Account

  alias PortfolioMonitor.Portfolio.HistoricalDatum

  def list_historical_data do
    Repo.all(HistoricalDatum)
  end

  def bitmex_acc_historical_data(bitmex_acc) do
    query =
      from h in HistoricalDatum,
        where: h.bitmex_acc_id == ^bitmex_acc.id,
        order_by: h.inserted_at

    Repo.all(query)
  end

  def create_historical_datum(attrs \\ %{}) do
    %HistoricalDatum{}
    |> HistoricalDatum.changeset(attrs)
    |> Repo.insert()
  end
end
