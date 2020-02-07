import React from 'react'
import {Card, Descriptions, Spin} from 'antd'
import Chart from './Chart'
import {BitmexAcc} from '../types';

const opt = {
  scales: {
    yAxes: [
      {
        id: 'prices',
        type: 'linear',
        position: 'left',
        ticks: {
          display: false
        }
      },
      {
        id: 'btcBalance',
        type: 'linear',
        position: 'left',
        ticks: {
          display: false
        }
      },
      {
        id: 'usdBalance',
        type: 'linear',
        position: 'left',
        ticks: {
          display: false
        }
      }
    ],
    xAxes: [
      {
        ticks: {
          display: false
        }
      }
    ]
  },
  tooltips: {
    mode: 'index',
    intersect: false
  }
}

export default ({style, acc}: {acc: BitmexAcc}) => {
  let labels = []
  let prices = []
  let btcBalance = []
  let usdBalance = []

  for (let i = 0; i < acc.historical_data.length; i++) {
    const item = acc.historical_data[i]
    labels.push(item.inserted_at)
    prices.push(item.btc_price)
    const btc = (item.wallet_balance_btc / (10 ** 8)).toFixed(4)
    btcBalance.push(btc)
    usdBalance.push((btc * item.btc_price).toFixed(2))
  }

  let datasets = [
    {
      label: "BTC Price",
      data: prices,
      fill: false,
      yAxisID: "prices",
      borderColor: 'gold',
      pointBackgroundColor: 'gold'
    },
    {
      label: "BTC Balance",
      data: btcBalance,
      fill: false,
      yAxisID: "btcBalance",
      borderColor: "blue",
      pointBackgroundColor: "blue"
    },
    {
      label: "USD Balance",
      data: usdBalance,
      fill: false,
      yAxisID: "usdBalance",
      borderColor: "deeppink",
      pointBackgroundColor: "deeppink"
    }
  ]


  const data = {
    labels: acc.historical_data.map((item) => (new Date(item.inserted_at).toLocaleString())),
    datasets
  }

  const rsi = (acc.wallet_balance_now - acc.deposit_btc) / (10 ** 8)
  const usdBalance = rsi * acc.lastPrice
  const leverage = Math.abs(acc.unrealisedPnl / acc.margin_balance)
  
  return (
    <Card title={acc.name} style={{...style}}>
      <Descriptions>
        <Descriptions.Item span={3} label="Return since inception">
          {(rsi / (acc.deposit_btc / (10 ** 8))).toFixed(2)}% / BTC {rsi.toFixed(8)} / USD { usdBalance ? usdBalance.toFixed(2) : <Spin /> }
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Earned this month">Test</Descriptions.Item>
        <Descriptions.Item span={3} label="Earned past 7-days">Test</Descriptions.Item>
        <Descriptions.Item span={3} label="Earned past 24-hours">Test</Descriptions.Item>
        <Descriptions.Item span={3} label="Paper gains">{acc.unrealisedPnl ? (acc.unrealisedPnl / (10 ** 8)).toFixed(8) : <Spin />}</Descriptions.Item>
        <Descriptions.Item span={3} label="Current leverage">{leverage ? leverage.toFixed(1) : <Spin />}</Descriptions.Item>
        <Descriptions.Item span={3} label="Open position">{acc.currentQty ? acc.currentQty : <Spin />}</Descriptions.Item>
        <Descriptions.Item span={3} label="Liquidation price">{acc.liquidationPrice ? acc.liquidationPrice : <Spin />}</Descriptions.Item>
        <Descriptions.Item span={3} label="Ave. entry price">Test</Descriptions.Item>
        <Descriptions.Item span={3} label="Balance">{(acc.wallet_balance_now / (10 ** 8)).toFixed(4)}</Descriptions.Item>
        <Descriptions.Item span={3} label="Note">{acc.notes}</Descriptions.Item>
      </Descriptions>
      <Chart height="50%" options={opt} data={data} />
    </Card>
  )
}