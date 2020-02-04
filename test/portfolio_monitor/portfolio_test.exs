defmodule PortfolioMonitor.PortfolioTest do
  use PortfolioMonitor.DataCase

  alias PortfolioMonitor.Portfolio

  describe "historical_data" do
    alias PortfolioMonitor.Portfolio.HistoricalDatum

    @valid_attrs %{btc_price: 42, wallet_balance: 42}
    @update_attrs %{btc_price: 43, wallet_balance: 43}
    @invalid_attrs %{btc_price: nil, wallet_balance: nil}

    def historical_datum_fixture(attrs \\ %{}) do
      {:ok, historical_datum} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Portfolio.create_historical_datum()

      historical_datum
    end

    test "list_historical_data/0 returns all historical_data" do
      historical_datum = historical_datum_fixture()
      assert Portfolio.list_historical_data() == [historical_datum]
    end
    
    test "create_historical_datum/1 with valid data creates a historical_datum" do
      assert {:ok, %HistoricalDatum{} = historical_datum} = Portfolio.create_historical_datum(@valid_attrs)
      assert historical_datum.btc_price == 42
      assert historical_datum.wallet_balance == 42
    end

    test "create_historical_datum/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Portfolio.create_historical_datum(@invalid_attrs)
    end

  end
end
