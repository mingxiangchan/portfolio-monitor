import React from 'react'
import {Spin} from 'antd'

export const formatBTC = (amnt: number) => (amnt / (10 ** 8)).toFixed(8)
export const formatEarnings = (btcT0: number, btcT1: number, usdT0: number, lastPrice: number) => {
  console.log(btcT0, btcT1, usdT0, lastPrice)
  const btcEarned = formatBTC(btcT1 - btcT0)
  const usdEarned = (formatBTC(btcT1) * lastPrice) - usdT0
  const usdPercentEarned = (usdEarned / usdT0).toFixed(2)
  return (
    <React.Fragment>
      {
        usdT0 === 0
          ? "NA"
          : usdPercentEarned 
            ? `${usdPercentEarned}%` : <Spin/> }
      / BTC {btcEarned ? btcEarned : <Spin/>} 
      / USD {usdEarned === 0 || usdEarned  ? usdEarned.toFixed(2)  : <Spin/>} 
    </React.Fragment>
  )
}
