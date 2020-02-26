import React, { createContext, useContext } from 'react'
import AccountsContext from './AccountsContext'
import { DashboardContext } from './DashboardContext'
import { BitmexContext } from './BitmexContext'
import { BitmexAcc, HistoricalData } from '../types'
import { satToBtc, centsToFiat } from '../utils/priceFormat'

const calculateEarnings = (
  btcBalance: number,
  fiatBalance: number,
  history: HistoricalData,
) => {
  const { wallet_balance_usd, wallet_balance_btc } = history
  return {
    btc: {
      symbol: 'BTC',
      precision: 8,
      absoluteValue: satToBtc(btcBalance - wallet_balance_btc),
      percentValue:
        ((btcBalance - wallet_balance_btc) / wallet_balance_btc) * 100,
    },
    fiat: {
      symbol: 'USD',
      precision: 2,
      absoluteValue: centsToFiat(fiatBalance - wallet_balance_usd),
      percentValue:
        ((fiatBalance - wallet_balance_usd) / wallet_balance_usd) * 100,
    },
  }
}

const calculateFields = (acc: BitmexAcc, livePrice: number) => {
  const btcBalance = acc.marginBalance
  const fiatBalance = satToBtc(btcBalance) * livePrice
  const liquidationPrice = acc.liquidationPrice
  const liquidationDistanceAbs = acc.liquidationPrice - livePrice
  const liquidationDistancePer = (liquidationDistanceAbs / livePrice) * 100
  const openPos = acc.currentQty
  const openPosBtc =
    acc.currentQty / (acc.lastPrice ? acc.lastPrice : livePrice)
  const leverage = Math.abs(acc.currentQty / fiatBalance)

  const earningsInception = calculateEarnings(
    btcBalance,
    fiatBalance,
    acc.historical_data[0],
  )
  const earnings1day = calculateEarnings(
    btcBalance,
    fiatBalance,
    acc.balance1day,
  )
  const earnings7days = calculateEarnings(
    btcBalance,
    fiatBalance,
    acc.balance7days,
  )
  const earnings30days = calculateEarnings(
    btcBalance,
    fiatBalance,
    acc.balance30days,
  )

  return {
    btcBalance: satToBtc(btcBalance),
    fiatBalance: centsToFiat(fiatBalance),
    liquidationPrice: centsToFiat(liquidationPrice),
    liquidationDistanceAbs: centsToFiat(liquidationDistanceAbs),
    liquidationDistancePer: liquidationDistancePer,
    openPos,
    openPosBtc,
    leverage,
    earningsInception,
    earnings1day,
    earnings7days,
    earnings30days,
  }
}

const CalculationsContext = createContext(null)

const CalculationsContextProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const { accounts } = useContext(AccountsContext)
  const { testnet } = useContext(DashboardContext)
  const prices = useContext(BitmexContext)

  const calculatedAccounts: BitmexAcc[] = []

  for (const id in accounts) {
    const account = accounts[id]
    const pairPrices = prices['XBTUSD']
    const livePrice = testnet ? pairPrices.testPrice : pairPrices.livePrice
    calculatedAccounts.push({
      ...account,
      calculated: {
        ...calculateFields(account, livePrice),
      },
    })
  }

  return (
    <CalculationsContext.Provider value={{ accs: calculatedAccounts }}>
      {children}
    </CalculationsContext.Provider>
  )
}

export { CalculationsContext, CalculationsContextProvider }
