# PortfolioMonitor

To start your Phoenix server:

  * Install dependencies with `mix deps.get`
  * Create and migrate your database with `mix ecto.setup`
  * Install Node.js dependencies with `cd assets && npm install`
  * Start Phoenix endpoint with `mix phx.server`

## Adding a Bitmex Acc

```
iex -S mix

>> Account.create_bitmex_acc(%{api_key: api_key, api_secret: api_secret})
```

## Generating AES Key

```
iex -S mix

>> ExCrypto.generate_aes_key(:aes_256, :base_64) 
```