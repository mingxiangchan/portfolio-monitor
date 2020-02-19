import React from 'react'
import { Spin } from 'antd'

export const formatEarnings = (
  btcT0: number,
  btcT1: number,
  usdT0: number,
  lastPrice: number,
): React.ReactNode => {
  const btcEarned = btcT1 - btcT0
  const usdEarned = btcT1 * lastPrice - usdT0
  const usdPercentEarned = ((usdEarned / usdT0) * 100).toFixed(2)

  const displayEarnings = (): React.ReactNode => (
    <React.Fragment>
      {usdPercentEarned ? `${usdPercentEarned}%` : <Spin />}/ BTC{' '}
      {btcEarned ? btcEarned.toFixed(8) : <Spin />}/ USD{' '}
      {usdEarned === 0 || usdEarned ? usdEarned.toFixed(2) : <Spin />}
    </React.Fragment>
  )
  return (
    <React.Fragment>
      {parseInt(usdT0) === 0 ? 'NA' : displayEarnings()}
    </React.Fragment>
  )
}
