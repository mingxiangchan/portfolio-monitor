# In this file, we load production configuration and secrets
# from environment variables. You can also hardcode secrets,
# although such is generally not recommended and you have to
# remember to add this file to your .gitignore.
use Mix.Config

database_url =
  System.get_env("DATABASE_URL") ||
    raise """
    environment variable DATABASE_URL is missing.
    For example: ecto://USER:PASS@HOST/DATABASE
    """

secret_key_base =
  System.get_env("SECRET_KEY_BASE") ||
    raise """
    environment variable SECRET_KEY_BASE is missing.
    You can generate one by calling: mix phx.gen.secret
    """

aes_key =
  System.get_env("AES_KEY") ||
    raise """
    environment variable AES_KEY is missing.
    """

app_name =
  System.get_env("APP_NAME") ||
    raise """
    environment variable APP_NAME is missing.
    """

redis_url = 
  System.get_env("REDIS_URL") ||
    raise """
    environment variable REDIS_URL is missing.
    """

config :portfolio_monitor, PortfolioMonitor.Repo,
  ssl: true,
  url: database_url,
  # free tier has 4 connections, running mix will require 2 each
  pool_size: 2

config :portfolio_monitor, PortfolioMonitorWeb.Endpoint,
  http: [:inet6, port: String.to_integer(System.get_env("PORT") || "4000")],
  secret_key_base: secret_key_base,
  url: [host: System.get_env("APP_NAME") <> ".gigalixirapp.com", port: 80]

# temp
config :portfolio_monitor, :redis_url, redis_url

config :portfolio_monitor, :aes_key, aes_key

config :portfolio_monitor, :secret_key_base, secret_key_base

config :joken, default_signer: app_name
