import React from 'react'
import { BitmexAcc } from '../types'
import Chart from './Chart'

const opt = {
  scales: {
    yAxes: [
      {
        id: 'prices',
        type: 'linear',
        position: 'left',
        ticks: {
          display: false,
        },
      },
      {
        id: 'btcBalance',
        type: 'linear',
        position: 'left',
        ticks: {
          display: false,
        },
      },
      {
        id: 'usdBalance',
        type: 'linear',
        position: 'left',
        ticks: {
          display: false,
        },
      },
    ],
    xAxes: [
      {
        ticks: {
          display: false,
        },
      },
    ],
  },
  tooltips: {
    mode: 'index',
    intersect: false,
  },
}

export default ({ acc }: { acc: BitmexAcc }) => {
  const labels = []
  const prices = []
  const btcBalance = []
  const usdBalance = []

  for (let i = 0; i < acc.historical_data.length; i++) {
    const item = acc.historical_data[i]
    labels.push(item.inserted_at)
    prices.push(item.btc_price)
    const btc = (item.wallet_balance_btc / 10 ** 8).toFixed(4)
    btcBalance.push(btc)
    usdBalance.push((btc * item.btc_price).toFixed(2))
  }

  const datasets = [
    {
      label: 'BTC Price',
      data: prices.concat([acc.lastPrice]),
      fill: false,
      yAxisID: 'prices',
      borderColor: 'gold',
      pointBackgroundColor: 'gold',
    },
    {
      label: 'BTC Balance',
      data: btcBalance.concat([(acc.wallet_balance_now / 10 ** 8).toFixed(4)]),
      fill: false,
      yAxisID: 'btcBalance',
      borderColor: 'blue',
      pointBackgroundColor: 'blue',
    },
    {
      label: 'USD Balance',
      data: usdBalance.concat([
        ((acc.lastPrice * acc.wallet_balance_now) / 10 ** 8).toFixed(2),
      ]),
      fill: false,
      yAxisID: 'usdBalance',
      borderColor: 'deeppink',
      pointBackgroundColor: 'deeppink',
    },
  ]

  const data = {
    labels: acc.historical_data
      .map(item => new Date(item.inserted_at).toLocaleString())
      .concat(['Now']),
    datasets,
  }

  return <Chart height="50%" options={opt} data={data} />
}
