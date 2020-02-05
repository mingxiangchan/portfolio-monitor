# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :portfolio_monitor,
  ecto_repos: [PortfolioMonitor.Repo]

# Configures the endpoint
config :portfolio_monitor, PortfolioMonitorWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "zblN7RQqvS5IaCYiM7iYcH1Y81QYnfIgOFS3OcpjaP8DtZdPo2vfM3Ie0/CpH0uF",
  render_errors: [view: PortfolioMonitorWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: PortfolioMonitor.PubSub, adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"

config :portfolio_monitor, :pow,
  user: PortfolioMonitor.Account.User,
  repo: PortfolioMonitor.Repo

config :portfolio_monitor, PortfolioMonitor.Scheduler,
  jobs: [
    # Record current btc price every 1 hr
    {"0 * * * *", {PortfolioMonitor.Portfolio, :record_current_btc_price, []}}
  ]
