defmodule PortfolioMonitor.Account do
  import Ecto.Query, warn: false
  alias PortfolioMonitor.Repo

  alias PortfolioMonitor.Account.BitmexAcc

  def list_bitmex_accs do
    Repo.all(BitmexAcc)
  end

  def create_bitmex_acc(attrs \\ %{}) do
    %BitmexAcc{}
    |> BitmexAcc.changeset(attrs)
    |> Repo.insert()
  end
end
