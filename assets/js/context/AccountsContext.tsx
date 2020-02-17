import React, { useEffect, useState } from 'react'
import { notification, message } from 'antd'
import { BitmexAcc, BitmexAccsState } from '../types'
import { afterJoinedAccChannel } from '../socket'

const AccountsContext = React.createContext(null)

export const AccountsContextProvider = ({ children }) => {
  const [accounts, setAccs] = useState<BitmexAccsState>(null)
  useEffect(() => {
    notification.info({ message: 'Loading Accounts' })
    afterJoinedAccChannel(accChannel => {
      accChannel
        .push('get_accs')
        .receive('ok', ({ accs }: { accs: BitmexAccsState }) => {
          for (const id in accs) {
            accs[id].wallet_balance_now

            accs[id].wallet_balance_1_day = accs[id].wallet_balance_1_day
              ? accs[id].wallet_balance_1_day
              : accs[id].wallet_balance_now

            accs[id].wallet_balance_7_days = accs[id].wallet_balance_7_days
              ? accs[id].wallet_balance_7_days
              : accs[id].wallet_balance_1_day

            accs[id].wallet_balance_30_days = accs[id].wallet_balance_30_days
              ? accs[id].wallet_balance_30_days
              : accs[id].wallet_balance_7_days

            setAccs(accs)
          }

          notification.success({
            message: 'Accounts Loaded',
            description: 'If no accounts display, try toggling to testnet',
          })

          accChannel.on('acc_update', ({ acc }: { acc: BitmexAcc }) => {
            setAccs(prevAccs => {
              const {
                wallet_balance_now,
                wallet_balance_1_day,
                wallet_balance_7_days,
                wallet_balance_30_days,
              } = acc
              return {
                ...prevAccs,
                [acc.id]: {
                  ...prevAccs[acc.id],
                  ...acc,
                  wallet_balance_1_day: wallet_balance_1_day
                    ? wallet_balance_1_day
                    : wallet_balance_now,
                  wallet_balance_7_days: wallet_balance_7_days
                    ? wallet_balance_7_days
                    : wallet_balance_1_day,
                  wallet_balance_30_days: wallet_balance_30_days
                    ? wallet_balance_30_days
                    : wallet_balance_7_days,
                },
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
