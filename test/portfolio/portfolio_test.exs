defmodule PortfolioMonitor.PortfolioTest do
  use PortfolioMonitor.DataCase
  use ExVCR.Mock, adapter: ExVCR.Adapter.Hackney
  alias PortfolioMonitor.Portfolio
  alias PortfolioMonitor.Repo

  describe "record_wallet_balance" do
    test "when api credentials are valid" do
      # Given
      api_key = "RsQ3vToW8TuTiH4elmdlsDvN"
      api_secret = "d4PNEA2VytGOjK2BzYsetOkXSPZSUkK2XBilLnZ7Pl5JvrnC"
      btc_price = 9576.5
      acc = insert(:bitmex_acc, api_key: api_key, api_secret: api_secret)
      PortfolioMonitorWeb.Endpoint.subscribe("bitmex_accs:#{acc.user_id}")

      # When
      use_cassette "record_wallet_balance_authorized" do
        Portfolio.record_wallet_balance(acc, btc_price)
      end

      # Then
      historical_data = Portfolio.list_historical_data() |> hd
      assert(historical_data.bitmex_acc_id == acc.id)
      assert(historical_data.wallet_balance == 973_464)
      assert(historical_data.margin_balance == 953_234)

      assert_receive %Phoenix.Socket.Broadcast{event: "acc_update", payload: payload}
    end

    test "when api_credentials are invalid" do
      btc_price = 9576.5
      # default api_credentials is "test"
      acc = insert(:bitmex_acc)

      # When
      use_cassette "record_wallet_balance_unauthorized" do
        Portfolio.record_wallet_balance(acc, btc_price)
      end

      # Then
      updated_acc = Repo.get(Portfolio.BitmexAcc, acc.id)
      assert(updated_acc.detected_invalid == true)
    end
  end
end
