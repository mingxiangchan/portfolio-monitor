# PortfolioMonitor

To start your Phoenix server:

  * Install dependencies with `mix deps.get`
  * Create and migrate your database with `mix ecto.setup`
  * Install Node.js dependencies with `cd assets && yarn`
  * Start Phoenix endpoint with `mix phx.server`

## Generating AES Key

Must be set in production

```
iex -S mix

>> ExCrypto.generate_aes_key(:aes_256, :base_64)
```

## Useful Commands for Testing

```elixir
# Record current BTC prices
Portfolio.record_current_btc_price()

# Record historical data for all valid bitmex accs
Portfolio.record_wallet_balances()

# Record historical data for a specific bitmex acc
acc = Repo.get(Portfolio.BitmexAcc, 1)
prices = Portfolio.get_last_bitmex_history()
Portfolio.record_wallet_balance(acc, prices)
```
