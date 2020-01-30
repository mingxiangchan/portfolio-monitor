use Mix.Config

config :portfolio_monitor, PortfolioMonitorWeb.Endpoint, server: true

config :logger, level: :info

config :ex_bitmex, test_mode: true

import_config "prod.secret.exs"
