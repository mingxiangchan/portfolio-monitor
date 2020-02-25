import React, { useEffect, useState } from 'react'
import { afterJoinedGeneralChannel } from '../socket'

const BitmexContext = React.createContext(null)

const BitmexContextProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [testPrice, changeTestPrice] = useState(0)
  const [realPrice, changeRealPrice] = useState(0)
  const [openTestPrice, changeOpenTestPrice] = useState(1)
  const [openRealPrice, changeOpenRealPrice] = useState(1)

  useEffect(() => {
    afterJoinedGeneralChannel(generalChannel => {
      generalChannel.push('get_opening_price').receive('ok', resp => {
        // change all received valeues from bitmex into cents
        changeOpenTestPrice(resp.opening_test_price * 100)
        changeOpenRealPrice(resp.opening_real_price * 100)
        // set testPrice and realPrice one-time
        changeTestPrice(parseFloat(resp.opening_test_price) * 100)
        changeTestPrice(parseFloat(resp.opening_real_price) * 100)
      })

      generalChannel.on('testnet_price', resp => {
        const newPrice: number = resp.data.data[0].price
        changeTestPrice(newPrice * 100)
      })

      generalChannel.on('livenet_price', resp => {
        const newPrice: number = resp.data.data[0].price
        changeRealPrice(newPrice * 100)
      })
    })
  }, [])

  const contextValue = {
    testPrice,
    realPrice,
    openTestPrice,
    openRealPrice,
  }

  return (
    <BitmexContext.Provider value={contextValue}>
      {children}
    </BitmexContext.Provider>
  )
}

export { BitmexContext, BitmexContextProvider }
