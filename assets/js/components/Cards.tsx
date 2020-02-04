import React from 'react'
import {Card} from 'antd'
import Chart from './Chart'

const opt = {
  scales: {
    yAxes: [
      {
        id: 'f',
        type: 'linear',
        position: 'left'
      },
      {
        id: 's',
        type: 'linear',
        position: 'left'
      }
    ]
  },
  tooltips: {
    mode: 'index',
    intersect: false
  },
  maintainAspectRatio: false
}

export default ({title, data, style}) => {

  return (
    <Card title={title} style={{...style}}>
      <p>Return since inception</p>
      <p>Earned this month</p>
      <p>Earned past 7-days</p>
      <p>Earned past 24-hours</p>
      <p>Paper gains</p>
      <p>Current leverage</p>
      <p>Open position</p>
      <p>Liquidation price</p>
      <p>Ave. entry price</p>
      <p>Balance</p>
      <Chart height="50%" options={opt} data={data} />
    </Card>
  )
}