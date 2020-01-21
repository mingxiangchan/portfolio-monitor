defmodule PortfolioMonitor.Repo do
  use Ecto.Repo,
    otp_app: :portfolio_monitor,
    adapter: Ecto.Adapters.Postgres
end
