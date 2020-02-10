import React from 'react'
import {Spin} from 'antd'

const formatBTC = (amnt: number) => (amnt / (10 ** 8)).toFixed(8)
export const formatEarnings = (start: number, end: number, price: number) => {
  const diff = end - start
  const percent = (diff / start).toFixed(2)
  const btc = formatBTC(diff)
  const usd = diff * price
  return (
    <React.Fragment>
		 	{percent}% / BTC {btc} / USD {usd ? usd.toFixed(2) : <Spin />}
    </React.Fragment>
  )
}