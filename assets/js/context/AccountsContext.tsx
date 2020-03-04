import React, { useEffect, useState } from 'react'
import { notification, message } from 'antd'
import {
  BitmexAccsState,
  BitmexAcc,
  BitmexWsMarginDetails,
  BitmexWsPositionDetails,
  HistoricalData,
} from '../types'
import { afterJoinedAccChannel } from '../socket'

const AccountsContext = React.createContext(null)

const getPastBalance = (
  historicalData: HistoricalData[],
  numPrevDays: number,
): HistoricalData => {
  const targetIdx = historicalData.length - 1 - numPrevDays
  const target = historicalData[targetIdx]

  if (!target) {
    return historicalData[0]
  }

  return target
}

const initializeAccDetails = (acc: BitmexAcc): BitmexAcc => {
  const recentHistory = acc.historical_data[acc.historical_data.length - 1]
  return {
    ...acc,
    avgEntryPrice: recentHistory.avg_entry_price,
    marginBalance: recentHistory.margin_balance,
    walletBalance: recentHistory.wallet_balance_btc,
    fiatBalance: recentHistory.wallet_balance_usd,
    pendingFirstQuery: acc.historical_data.length === 1,
    balance1day: getPastBalance(acc.historical_data, 1),
    balance7days: getPastBalance(acc.historical_data, 7),
    balance30days: getPastBalance(acc.historical_data, 30),

    currentQty: null,
    lastPrice: null,
    liquidationPrice: null,
    unrealisedPnl: null,
  }
}

const onGetAccs = ({ accs }, setAccs) => {
  const formatedAccs = {}
  for (const id in accs) {
    const acc = accs[id]
    formatedAccs[id] = initializeAccDetails(acc)
  }

  setAccs(formatedAccs)

  notification.success({
    message: 'Accounts Loaded',
    description: 'If no accounts display, try toggling to testnet',
  })
}

const onAccUpdate = ({ acc }, setAccs) => {
  setAccs((prevAccs: BitmexAccsState) => {
    const oldAcc = prevAccs[acc.id]

    if (oldAcc) {
      return { ...prevAccs, [acc.id]: { ...oldAcc, ...acc } }
    } else {
      return { ...prevAccs, [acc.id]: initializeAccDetails(acc) }
    }
  })
}

const onAccDeleted = ({ acc }, setAccs) => {
  setAccs((prevAccs: BitmexAccsState) => {
    message.warning(`Deleted account with ID: ${acc.id}`)
    delete prevAccs[acc.id]
    return { ...prevAccs }
  })
}

const onWsMargin = (resp: BitmexWsMarginDetails, setAccs) => {
  const id = resp.acc_id
  const { unrealisedPnl, walletBalance, marginBalance } = resp.data[0]

  setAccs((prevAccs: BitmexAccsState) => {
    const oldAcc = prevAccs[id]
    // acc may have just been deleted but ws is not cleared yet

    if (oldAcc) {
      const updatedAcc = {
        ...oldAcc,
        ...(unrealisedPnl && { unrealisedPnl }),
        ...(walletBalance && { walletBalance }),
        ...(marginBalance && { marginBalance }),
      }

      return { ...prevAccs, [id]: updatedAcc }
    } else {
      delete prevAccs[id]
      return { ...prevAccs }
    }
  })
}

const onWsPosition = (resp: BitmexWsPositionDetails, setAccs) => {
  const id = resp.acc_id
  const { currentQty, liquidationPrice, avgEntryPrice } = resp.data[0]

  setAccs((prevAccs: BitmexAccsState) => {
    const oldAcc = prevAccs[id]
    if (oldAcc) {
      const avgEntryPriceCents = avgEntryPrice * 100
      // acc may have just been deleted but ws is not cleared yet
      const updatedAcc = {
        ...oldAcc,
        ...(avgEntryPrice && { avgEntryPriceCents }),
        currentQty,
        liquidationPrice: liquidationPrice * 100,
      }

      return { ...prevAccs, [id]: updatedAcc }
    } else {
      delete prevAccs[id]
      return { ...prevAccs }
    }
  })
}

export const AccountsContextProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const [loadingAcc, setLoadingAcc] = useState(true)
  const [accounts, setAccs] = useState<BitmexAccsState>(null)
  useEffect(() => {
    notification.info({ message: 'Loading Accounts' })

    afterJoinedAccChannel(accChannel => {
      accChannel.push('get_accs').receive('ok', resp => {
        setLoadingAcc(false)
        onGetAccs(resp, setAccs)
      })

      accChannel.on('acc_update', resp => onAccUpdate(resp, setAccs))
      accChannel.on('acc_deleted', resp => onAccDeleted(resp, setAccs))
      accChannel.on('ws_margin', resp => onWsMargin(resp, setAccs))
      accChannel.on('ws_position', resp => onWsPosition(resp, setAccs))
    })
  }, [])

  return (
    <AccountsContext.Provider value={{ accounts, loadingAcc }}>
      {children}
    </AccountsContext.Provider>
  )
}

export default AccountsContext
