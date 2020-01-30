defmodule PortfolioMonitor.Account do
  import Ecto.Query, warn: false
  alias PortfolioMonitor.Repo

  alias PortfolioMonitor.Account.BitmexAcc
  alias PortfolioMonitor.Sync
  alias PortfolioMonitor.Users.User

  def list_bitmex_accs do
    Repo.all(BitmexAcc)
  end

  def create_bitmex_acc(attrs \\ %{}) do
    %BitmexAcc{}
    |> BitmexAcc.changeset(attrs)
    |> Repo.insert()
    |> case do
      {:ok, bitmex_acc} ->
        Sync.Supervisor.start_child(bitmex_acc)
        {:ok, bitmex_acc}

      error ->
        error
    end
  end

  def change_bitmex_acc(bitmex_acc) do
    BitmexAcc.changeset(bitmex_acc, %{})
  end

  def current_user_with_accs(conn) do
    user = Pow.Plug.current_user(conn)
    Repo.one(from(u in User, preload: [:bitmex_accs]), user.id)
  end
end
