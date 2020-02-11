use Mix.Config

# Configure your database
config :portfolio_monitor, PortfolioMonitor.Repo,
  username: "postgres",
  password: "postgres",
  database: "portfolio_monitor_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :portfolio_monitor, PortfolioMonitorWeb.Endpoint,
  http: [port: 4002],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

config :portfolio_monitor, :aes_key, "M4__0myz68RiGgag2XpzPF5A4oPfO6f1H5XChHhxvwo="

config :portfolio_monitor,
       :secret_key_base,
       "ttEwRdRVyM2mAgp0Mq2gXYSASyRW257T72QvqjFD/FsOp67Sagf+DZq1mRWjHaKo"
