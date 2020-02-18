import React, { useEffect, useState } from 'react'
import { notification, message } from 'antd'
import { BitmexAcc, BitmexAccsState } from '../types'
import { afterJoinedAccChannel } from '../socket'
import { formatBTC } from '../utils/priceFormat'

const AccountsContext = React.createContext(null)

const setFallbackValues = (acc) => {
  const {wallet_balance_1_day ,wallet_balance_7_days, wallet_balance_30_days, btc_price_1_day, btc_price_7_days, btc_price_30_days, deposit_btc, deposit_usd} = acc
  if(acc.wallet_balance_1_day){
    
    acc.fiatBal1 = formatBTC(wallet_balance_1_day) * btc_price_1_day 
  } else {
    acc.wallet_balance_1_day = deposit_btc
    acc.fiatBal1 = deposit_usd 
  }
  
  if(acc.wallet_balance_7_days){
    acc.fiatBal7 = formatBTC(wallet_balance_7_days) * btc_price_7_days 
  } else {
    acc.wallet_balance_7_days = deposit_btc
    acc.fiatBal7 = deposit_usd 
  }

  if(acc.wallet_balance_30_days){
    acc.fiatBal30 = formatBTC(wallet_balance_30_days) * btc_price_30_days 
  } else {
    acc.wallet_balance_30_days = deposit_btc
    acc.fiatBal30 = deposit_usd 
  }  
  return acc
}

export const AccountsContextProvider: React.FunctionComponent = ({
  children,
}) => {
  const [accounts, setAccs] = useState<BitmexAccsState>(null)
  useEffect(() => {
    notification.info({ message: 'Loading Accounts' })
    afterJoinedAccChannel(accChannel => {
      accChannel
        .push('get_accs')
        .receive('ok', ({ accs }: { accs: BitmexAccsState }) => {
          let completeAccs = {};
          for(const id in accs){
            completeAccs[id] = setFallbackValues(accs[id])
          }
          setAccs(completeAccs)

          notification.success({
            message: 'Accounts Loaded',
            description: 'If no accounts display, try toggling to testnet',
          })

          accChannel.on('acc_update', ({ acc }: { acc: BitmexAcc }) => {
            setAccs(prevAccs => {
              return {
                ...prevAccs,
                [acc.id]: setFallbackValues(acc),
              }
            })
          })

          accChannel.on('acc_deleted', ({ acc }: { acc: BitmexAcc }) => {
            setAccs(prevAccs => {
              message.warning(`Deleted account with ID: ${acc.id}`)
              delete prevAccs[acc.id]
              return { ...prevAccs }
            })
          })

          accChannel.on('ws_margin', resp => {
            const id = resp.acc_id
            const { unrealisedPnl, marginBalance } = resp.data[0]

            setAccs(prevAccs => {
              const oldAcc = prevAccs[id]
              // acc may have just been deleted but ws is not cleared yet
              if (oldAcc) {
                const updatedAcc = {
                  ...oldAcc,
                  ...(unrealisedPnl && { unrealisedPnl }),
                  ...(marginBalance && { marginBalance }),
                }
                return { ...prevAccs, [id]: updatedAcc }
              } else {
                delete prevAccs[id]
                return { ...prevAccs }
              }
            })
          })

          accChannel.on('ws_position', resp => {
            const id = resp.acc_id
            const { currentQty, liquidationPrice, avgEntryPrice } = resp.data[0]
            setAccs(prevAccs => {
              const oldAcc = prevAccs[id]
              // acc may have just been deleted but ws is not cleared yet
              if (oldAcc) {
                const updatedAcc = {
                  ...oldAcc,
                  currentQty,
                  liquidationPrice,
                  ...(avgEntryPrice
                    ? { avgEntryPrice }
                    : { avgEntryPrice: oldAcc.avg_entry_price }),
                }
                return { ...prevAccs, [id]: updatedAcc }
              } else {
                delete prevAccs[id]
                return { ...prevAccs }
              }
            })
          })
        })
    })
  }, [])

  return (
    <AccountsContext.Provider value={{ accounts }}>
      {children}
    </AccountsContext.Provider>
  )
}

export default AccountsContext
