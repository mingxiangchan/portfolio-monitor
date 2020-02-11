defmodule PortfolioMonitor.Factories do
  use ExMachina.Ecto, repo: PortfolioMonitor.Repo
  alias PortfolioMonitor.Account
  alias PortfolioMonitor.Portfolio

  def user_factory do
    %Account.User{
      email: sequence(:email, &"email-#{&1}@example.com"),
      password: "12345678",
      confirm_password: "12345678"
    }
  end

  def bitmex_acc_factory do
    %Portfolio.BitmexAcc{
      name: "Test Acc",
      notes: "Test Note",
      deposit_usd: 5050,
      deposit_btc: 500_000,
      detected_invalid: false,
      api_key: "test",
      api_secret: "test",
      user: build(:user)
    }
  end
end
