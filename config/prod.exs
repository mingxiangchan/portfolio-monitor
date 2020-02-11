use Mix.Config

config :portfolio_monitor, PortfolioMonitorWeb.Endpoint,
  server: true,
  instrumenters: [Appsignal.Phoenix.Instrumenter]

config :logger, level: :info

import_config "prod.secret.exs"
