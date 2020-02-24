import React, { useEffect, useState } from 'react'
import { notification, message } from 'antd'
import {
  BitmexAccsState,
  BitmexAcc,
  BitmexWsMarginDetails,
  BitmexWsPositionDetails,
} from '../types'
import { afterJoinedAccChannel } from '../socket'

const AccountsContext = React.createContext(null)

const initializeAccDetails = (acc: BitmexAcc): BitmexAcc => {
  return {
    ...acc,
    avgEntryPrice: acc.historical_data[0].avg_entry_price,
    marginBalance: acc.historical_data[0].margin_balance,
    walletBalance: acc.historical_data[0].wallet_balance_btc,
    fiatBalance: acc.historical_data[0].wallet_balance_usd,
    pendingFirstQuery: acc.historical_data.length === 1,
    balance1day: null,
    balance7days: null,
    balance30days: null,

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

    return { ...prevAccs, [acc.id]: { ...oldAcc, ...acc } }
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

  console.log(marginBalance)

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
    // acc may have just been deleted but ws is not cleared yet
    if (oldAcc) {
      const avgEntryPriceCents = avgEntryPrice * 100
      const updatedAcc = {
        ...oldAcc,
        currentQty,
        liquidationPrice: liquidationPrice * 100,
        avgEntryPrice: avgEntryPrice && { avgEntryPriceCents },
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
  const [accounts, setAccs] = useState<BitmexAccsState>(null)
  useEffect(() => {
    notification.info({ message: 'Loading Accounts' })

    afterJoinedAccChannel(accChannel => {
      accChannel
        .push('get_accs')
        .receive('ok', resp => onGetAccs(resp, setAccs))

      accChannel.on('acc_update', resp => onAccUpdate(resp, setAccs))
      accChannel.on('acc_deleted', resp => onAccDeleted(resp, setAccs))
      accChannel.on('ws_margin', resp => onWsMargin(resp, setAccs))
      accChannel.on('ws_position', resp => onWsPosition(resp, setAccs))
    })
  }, [])

  return (
    <AccountsContext.Provider value={{ accounts }}>
      {children}
    </AccountsContext.Provider>
  )
}

export default AccountsContext
