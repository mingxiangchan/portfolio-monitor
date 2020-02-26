import React, { useEffect, useState } from 'react'
import { afterJoinedGeneralChannel } from '../socket'
import { BitmexContextValue, BitmexTradeWS } from '../types'

const BitmexContext = React.createContext<BitmexContextValue>({})

const BitmexContextProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [prices, setPrices] = useState<BitmexContextValue>({})

  useEffect(() => {
    afterJoinedGeneralChannel(generalChannel => {
      generalChannel.push('get_opening_price').receive('ok', resp => {
        setPrices({
          ...resp.data.reduce(
            (acc, pair) => ({
              ...acc,
              [pair.symbol]: {
                openTestPrice: pair.opening_test_price * 100,
                openLivePrice: pair.opening_live_price * 100,
                testPrice: pair.opening_test_price * 100,
                livePrice: pair.opening_live_price * 100,
              },
            }),
            {},
          ),
        })
      })

      generalChannel.on('testnet_price', (resp: BitmexTradeWS) => {
        setPrices(prevPrices => ({
          ...prevPrices,
          ...resp.data.data.reduce(
            (acc, trade) => ({
              ...acc,
              [trade.symbol]: {
                ...prevPrices[trade.symbol],
                testPrice: trade.price * 100,
              },
            }),
            {},
          ),
        }))
      })

      generalChannel.on('livenet_price', (resp: BitmexTradeWS) => {
        setPrices(prevPrices => ({
          ...prevPrices,
          ...resp.data.data.reduce(
            (acc, trade) => ({
              ...acc,
              [trade.symbol]: {
                ...prevPrices[trade.symbol],
                livePrice: trade.price * 100,
              },
            }),
            {},
          ),
        }))
      })
    })
  }, [])

  return (
    <BitmexContext.Provider value={prices}>{children}</BitmexContext.Provider>
  )
}

export { BitmexContext, BitmexContextProvider }
