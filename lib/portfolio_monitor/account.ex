defmodule PortfolioMonitor.Account do
  import Ecto.Query, warn: false
  alias PortfolioMonitor.Repo

  alias PortfolioMonitor.Account.BitmexAcc
  alias PortfolioMonitor.Sync
  alias PortfolioMonitor.Account.User
  alias PortfolioMonitor.Portfolio

  def list_bitmex_accs do
    Repo.all(BitmexAcc)
  end

  def get_bitmex_acc(id) do
    Repo.get(BitmexAcc, id)
  end

  def create_bitmex_acc(user \\ %User{}, attrs \\ %{}) do
    user
    |> Ecto.build_assoc(:bitmex_accs, %{})
    |> BitmexAcc.changeset(attrs)
    |> Repo.insert()
    |> case do
      {:ok, bitmex_acc} ->
        {:ok, bitmex_acc}
      error ->
        error
    end
  end

  def change_bitmex_acc(bitmex_acc, changes \\ %{}) do
    bitmex_acc
    |> BitmexAcc.changeset(changes)
  end

  def update_bitmex_acc(%BitmexAcc{} = bitmex_acc, attrs) do
    bitmex_acc
    |> BitmexAcc.changeset(attrs)
    |> Repo.update()
  end

  def delete_bitmex_acc(%BitmexAcc{} = bitmex_acc) do
    Repo.delete(bitmex_acc)
  end

  def bitmex_acc_with_details(user) do
    query =
      from b in BitmexAcc,
        where: b.user_id == ^user.id,
        select: %{
          id: b.id,
          name: b.name,
          deposit_usd: b.deposit_usd,
          deposit_btc: b.deposit_btc,
          notes: b.notes
        }

    Repo.all(query)
  end
end
