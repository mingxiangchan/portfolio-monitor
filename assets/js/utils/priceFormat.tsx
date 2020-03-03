import React from 'react'
import { Spin } from 'antd'

export const centsToFiat = (val: number) => val / 100
export const satToBtc = (val: number) => val / 100000000

export const formatEarnings = (
  btcT0: number,
  btcT1: number,
  usdT0: number,
  lastPrice: number,
) => {
  const btcEarned = btcT1 - btcT0
  const usdEarned = satToBtc(btcT1 * lastPrice) - usdT0
  const usdPercentEarned = ((usdEarned / usdT0) * 100).toFixed(2)

  return `${usdPercentEarned}% / BTC ${satToBtc(btcEarned).toFixed(
    8,
  )} / USD ${centsToFiat(satToBtc(usdEarned)).toFixed(2)}`

  // const displayEarnings = (): React.ReactNode => (
  //   <React.Fragment>
  //     {usdPercentEarned ? `${usdPercentEarned}%` : <Spin />}/ BTC{' '}
  //     {btcEarned ? satToBtc(btcEarned).toFixed(8) : <Spin />}/ USD{' '}
  //     {usdEarned === 0 || usdEarned ? (
  //       centsToFiat(satToBtc(usdEarned)).toFixed(2)
  //     ) : (
  //       <Spin />
  //     )}
  //   </React.Fragment>
  // )
  // return (
  //   <React.Fragment>
  //     {parseInt(usdT0) === 0 ? 'NA' : displayEarnings()}
  //   </React.Fragment>
  // )
}
