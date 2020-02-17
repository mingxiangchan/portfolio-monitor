import React from 'react'
import { ChartOptions } from 'chart.js'
import Chart from './Chart'
import { BitmexAcc, CummulativeTotals } from '../types'

interface PropTypes {
  accs: BitmexAcc[]
  cummulativeBalance: number
  livePrice: number
}

const opts: ChartOptions = {
  scales: {
    yAxes: [
      {
        id: 'btcPrice',
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
  legend: {
    labels: {
      fontColor: '#999999',
    },
  },
}

const CummulativeChart: React.FunctionComponent<PropTypes> = ({
  accs,
  cummulativeBalance,
  livePrice,
}: PropTypes) => {
  const total: CummulativeTotals = {}

  for (let i = 0; i < accs.length; i++) {
    const acc = accs[i]
    if (!acc.historical_data) {
      continue
    }
    for (let y = 0; y < acc.historical_data.length; y++) {
      const history = acc.historical_data[y]
      const date = history.inserted_at // TODO: converted iso8601 time to hourly accuraccy
      const btcPrice = history.btc_price
      const btcBalance = history.wallet_balance_btc / 10 ** 8
      if (total[date]) {
        total[date].btcBalance += btcBalance
      } else {
        total[date] = {
          btcPrice,
          btcBalance,
        }
      }
    }
  }

  const graphData = { price: [], btcBalance: [], usdBalance: [] }
  const totalValues = Object.values(total)

  for (let i = 0; i < totalValues.length; i++) {
    const value = totalValues[i]
    const numericalBtcPrice = parseFloat(value.btcPrice)
    graphData.price.push(numericalBtcPrice)
    graphData.btcBalance.push(value.btcBalance.toFixed(4))
    graphData.usdBalance.push((numericalBtcPrice * value.btcBalance).toFixed(2))
  }

  const data = {
    labels: Object.keys(total)
      .map(time => new Date(time).toLocaleString())
      .concat(['Now']),
    datasets: [
      {
        label: 'BTC Price',
        data: graphData.price.concat([livePrice]),
        fill: false,
        yAxisID: 'btcPrice',
        borderColor: 'gold',
        pointBackgroundColor: 'gold',
      },
      {
        label: 'BTC Balance',
        data: graphData.btcBalance.concat([
          (cummulativeBalance / 10 ** 8).toFixed(4),
        ]),
        fill: false,
        yAxisID: 'btcBalance',
        borderColor: 'blue',
        pointBackgroundColor: 'blue',
      },
      {
        label: 'USD Balance',
        data: graphData.usdBalance.concat([
          ((cummulativeBalance * livePrice) / 10 ** 8).toFixed(2),
        ]),
        fill: false,
        yAxisID: 'usdBalance',
        borderColor: 'deeppink',
        pointBackgroundColor: 'deeppink',
      },
    ],
  }
  return <Chart data={data} options={opts} />
}

export default CummulativeChart
