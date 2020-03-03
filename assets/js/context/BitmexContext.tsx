import React, { useEffect, useState } from 'react'
import { afterJoinedGeneralChannel } from '../socket'
import {
  BitmexContextValue,
  BitmexTradeWS,
  BitmexOpeningPrices,
} from '../types'

const BitmexContext = React.createContext<BitmexContextValue>({})

const BitmexContextProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [prices, setPrices] = useState<BitmexContextValue>({})
  const [loadingChannel, setLoadingChannel] = useState(true)

  useEffect(() => {
    afterJoinedGeneralChannel(generalChannel => {
      generalChannel
        .push('get_opening_price')
        .receive('ok', (resp: BitmexOpeningPrices) => {
          setLoadingChannel(false)
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
          [resp.data.symbol]: {
            ...prevPrices[resp.data.symbol],
            testPrice: resp.data.price * 100,
          },
        }))
      })

      generalChannel.on('livenet_price', (resp: BitmexTradeWS) => {
        setPrices(prevPrices => ({
          ...prevPrices,
          [resp.data.symbol]: {
            ...prevPrices[resp.data.symbol],
            livePrice: resp.data.price * 100,
          },
        }))
      })
    })
  }, [])

  return (
    <BitmexContext.Provider value={prices}>{children}</BitmexContext.Provider>
  )
}

export { BitmexContext, BitmexContextProvider }
