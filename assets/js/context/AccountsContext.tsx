import React, {useEffect, useState} from 'react'
import {notification, message} from 'antd'
import {BitmexAcc, BitmexAccsState} from '../types'
import {afterJoinedAccChannel} from '../socket'

const AccountsContext = React.createContext(null)

export const AccountsContextProvider = ({children}) => {
  const [accounts, setAccs] = useState<BitmexAccsState>(null)
  useEffect(() => {
    notification.info({message: "Loading Accounts"})
    afterJoinedAccChannel(accChannel => {
      accChannel.push("get_accs").receive("ok", ({accs}: {accs: BitmexAccsState}) => {
        console.log(accs)
        setAccs(accs)
        notification.success({message: "Accounts Loaded", description: "If no accounts display, try toggling to testnet"})

        accChannel!.on("acc_update", ({acc}: {acc: BitmexAcc}) => {
          setAccs((prevAccs) => {
            return {...prevAccs, [acc.id]: acc}
          })
        })

        accChannel!.on("acc_deleted", ({acc}: {acc: BitmexAcc}) => {
          setAccs((prevAccs) => {
            message.warning(`Deleted account with ID: ${acc.id}`)
            const remainingAccs = prevAccs
            delete remainingAccs[acc.id]
            return remainingAccs
          })
        })

        accChannel!.on("ws_margin", resp => {
          const id = resp.acc_id
          const {unrealisedPnl, marginBalance} = resp.data[0]
          setAccs((prevAccs) => {
            const oldAcc = prevAccs[id]
            const updatedAcc = {...oldAcc, ...unrealisedPnl && {unrealisedPnl}, ...marginBalance && {marginBalance}}
            return {...prevAccs, [id]: updatedAcc}
          })
        })

        accChannel!.on("ws_position", resp => {
          const id = resp.acc_id
          const {currentQty, liquidationPrice, lastPrice, avgEntryPrice} = resp.data[0]
          setAccs((prevAccs) => {
            const oldAcc = prevAccs[id]
            const updatedAcc = {...oldAcc, currentQty, liquidationPrice, lastPrice: lastPrice ? lastPrice : oldAcc.lastPrice, ...avgEntryPrice ? {avgEntryPrice} : {avgEntryPrice: oldAcc.avg_entry_price}}
            return {...prevAccs, [id]: updatedAcc}
          })
        })
      })
    })
  }, [])

  return (
    <AccountsContext.Provider value={{accounts}}>
      {children}
    </AccountsContext.Provider>
  )
}

export default AccountsContext
