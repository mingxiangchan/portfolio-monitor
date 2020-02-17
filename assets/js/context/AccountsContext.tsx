import React, { useEffect, useState } from 'react'
import { notification, message } from 'antd'
import { BitmexAcc, BitmexAccsState } from '../types'
import { afterJoinedAccChannel } from '../socket'

const AccountsContext = React.createContext(null)

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
          setAccs(accs)

          notification.success({
            message: 'Accounts Loaded',
            description: 'If no accounts display, try toggling to testnet',
          })

          accChannel.on('acc_update', ({ acc }: { acc: BitmexAcc }) => {
            setAccs(prevAccs => {
              return {
                ...prevAccs,
                [acc.id]: acc,
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
