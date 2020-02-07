use Mix.Config

config :portfolio_monitor, PortfolioMonitorWeb.Endpoint, server: true

config :logger, level: :info

config :ex_bitmex,
  test_mode: true,
  domain: "testnet.bitmex.com"

import_config "prod.secret.exs"
