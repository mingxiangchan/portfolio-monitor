defmodule PortfolioMonitor.Account do
  import Ecto.Query, warn: false
  alias PortfolioMonitor.Account
  alias PortfolioMonitor.Repo

  def generate_jwt_token(%Account.User{} = user) do
    extra_claims = %{user_id: user.id}
    Account.Token.generate_and_sign(extra_claims)
  end

  def find_user(id) do
    Repo.get(Account.User, id)
  end
end
