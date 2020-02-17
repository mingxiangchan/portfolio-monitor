import React, { useEffect, useState } from 'react'
import { afterJoinedGeneralChannel } from '../socket'

const BitmexContext = React.createContext(null)

export const BitmexContextProvider = ({ children }) => {
  const [testPrice, changeTestPrice] = useState(0)
  const [realPrice, changeRealPrice] = useState(0)
  const [openTestPrice, changeOpenTestPrice] = useState(1)
  const [openRealPrice, changeOpenRealPrice] = useState(1)

  useEffect(() => {
    afterJoinedGeneralChannel(generalChannel => {
      generalChannel.push('get_opening_price').receive('ok', resp => {
        changeOpenTestPrice(resp.opening_test_price)
        changeOpenRealPrice(resp.opening_real_price)
        // set testPrice and realPrice one-time
        changeTestPrice(parseFloat(resp.opening_test_price))
        changeTestPrice(parseFloat(resp.opening_real_price))
      })

      generalChannel.on('testnet_price', resp => {
        const newPrice: number = resp.data.data[0].price
        changeTestPrice(newPrice)
      })

      generalChannel.on('livenet_price', resp => {
        const newPrice: number = resp.data.data[0].price
        changeRealPrice(newPrice)
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

export default BitmexContext
