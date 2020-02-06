import React from 'react'
import {Card, Descriptions} from 'antd'
import Chart from './Chart'
import {BitmexAcc} from '../types';

const opt = {
  scales: {
    yAxes: [
      {
        id: 'btcBalance',
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
  let btcBalance = []

  for (let i = 0; i < acc.historical_data.length; i++) {
    const item = acc.historical_data[i]
    labels.push(item.inserted_at)
    btcBalance.push((item.wallet_balance / (10 ** 8)).toFixed(4))
  }

  let datasets = [
    {
      label: "BTC Balance",
      data: btcBalance,
      fill: false,
      yAxisID: "btcBalance",
      borderColor: 'gold',
      pointBackgroundColor: 'gold'
    }
  ]


  const data = {
    labels: acc.historical_data.map((item) => (item.inserted_at)),
    datasets
  }

  return (
    <Card title={acc.name} style={{...style}}>
      <Descriptions>
        <Descriptions.Item span={3} label="Return since inception">Test</Descriptions.Item>
        <Descriptions.Item span={3} label="Earned this month">Test</Descriptions.Item>
        <Descriptions.Item span={3} label="Earned past 7-days">Test</Descriptions.Item>
        <Descriptions.Item span={3} label="Earned past 24-hours">Test</Descriptions.Item>
        <Descriptions.Item span={3} label="Paper gains">Test</Descriptions.Item>
        <Descriptions.Item span={3} label="Current leverage">Test</Descriptions.Item>
        <Descriptions.Item span={3} label="Open position">Test</Descriptions.Item>
        <Descriptions.Item span={3} label="Liquidation price">Test</Descriptions.Item>
        <Descriptions.Item span={3} label="Ave. entry price">Test</Descriptions.Item>
        <Descriptions.Item span={3} label="Balance">{(acc.wallet_balance_now / (10 ** 8)).toFixed(4)}</Descriptions.Item>
        <Descriptions.Item span={3} label="Note">{acc.notes}</Descriptions.Item>
      </Descriptions>
      <Chart height="50%" options={opt} data={data} />
    </Card>
  )
}