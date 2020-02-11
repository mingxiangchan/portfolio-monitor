import React, {useEffect, useState} from 'react'
import {BitmexAcc, BitmexAccsState} from '../types';
import {afterJoinedAccChannel} from '../socket';

const AccountsContext = React.createContext(null)

export const AccountsContextProvider = ({children}) => {
  const [accounts, setAccs] = useState<BitmexAccsState>(null)

  useEffect(() => {
    // @ts-ignore
    afterJoinedAccChannel(accChannel => {
      accChannel.push("get_accs").receive("ok", ({accs}: {accs: BitmexAccsState}) => {
        console.log(accs)
        setAccs(accs)

        accChannel!.on("acc_update", ({acc}: {acc: BitmexAcc}) => {
          setAccs((prevAccs) => {
            return {...prevAccs, [acc.id]: acc}
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
          // avgEntryPrice missing
          const {currentQty, liquidationPrice, lastPrice} = resp.data[0]
          setAccs((prevAccs) => {
            const oldAcc = prevAccs[id]
            const updatedAcc = {...oldAcc, currentQty, liquidationPrice, lastPrice: lastPrice ? lastPrice : oldAcc.lastPrice}
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
