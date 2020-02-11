import React, {useEffect, useState} from 'react'
import {generalChannel} from "../socket"

const BitmexContext = React.createContext(null)

export const BitmexContextProvider = ({children}) => {
  const [testPrice, changePrice] = useState(0)
  const [realPrice, changeRealPrice] = useState(0)
  const [openTestPrice, changeOpenTestPrice] = useState(1)
  const [openRealPrice, changeOpenRealPrice] = useState(1)

  useEffect(() => {
    generalChannel.push("get_opening_price").receive("ok", resp => {
      changeOpenTestPrice(resp.opening_test_price)
      changeOpenRealPrice(resp.opening_real_price)
    })

    generalChannel.on("testnet_price", resp => {
      const newPrice: number = resp.data.data[0].price
      changePrice(newPrice)
    })

    generalChannel.on("livenet_price", resp => {
      const newPrice: number = resp.data.data[0].price
      changeRealPrice(newPrice)
    })

  }, [])

  const contextValue = {
    testPrice,
    realPrice,
    openTestPrice,
    openRealPrice
  }

  return (
    <BitmexContext.Provider value={contextValue}>
      {children}
    </BitmexContext.Provider>
  )
}

export default BitmexContext
