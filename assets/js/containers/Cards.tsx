import React from 'react'
import {Card, Descriptions} from 'antd'
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
  }
}

export default ({title, data, style}) => {

  return (
    <Card title={title} style={{...style}}>
      <Descriptions>
        <Descriptions.Item span={24} label="Return since inception"></Descriptions.Item>
        <Descriptions.Item span={24} label="Earned this month"></Descriptions.Item>
        <Descriptions.Item span={24} label="Earned past 7-days"></Descriptions.Item>
        <Descriptions.Item span={24} label="Earned past 24-hours"></Descriptions.Item>
        <Descriptions.Item span={24} label="Paper gains"></Descriptions.Item>
        <Descriptions.Item span={24} label="Current leverage"></Descriptions.Item>
        <Descriptions.Item span={24} label="Open position"></Descriptions.Item>
        <Descriptions.Item span={24} label="Liquidation price"></Descriptions.Item>
        <Descriptions.Item span={24} label="Ave. entry price"></Descriptions.Item>
        <Descriptions.Item span={24} label="Balance"></Descriptions.Item>
        <Descriptions.Item span={24} label="Note"></Descriptions.Item>
      </Descriptions>
      <Chart height="50%" options={opt} data={data} />
    </Card>
  )
}