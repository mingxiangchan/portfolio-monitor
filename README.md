# PortfolioMonitor

To start your Phoenix server:

  * Install dependencies with `mix deps.get`
  * Create and migrate your database with `mix ecto.setup`
  * Install Node.js dependencies with `cd assets && yarn`
  * Start Phoenix endpoint with `mix phx.server`

## Generating AES Key

```
iex -S mix

>> ExCrypto.generate_aes_key(:aes_256, :base_64)
```
