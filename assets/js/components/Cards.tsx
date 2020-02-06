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
        <Descriptions.Item span={3} label="Return since inception">Test</Descriptions.Item>
        <Descriptions.Item span={3} label="Earned this month">Test</Descriptions.Item>
        <Descriptions.Item span={3} label="Earned past 7-days">Test</Descriptions.Item>
        <Descriptions.Item span={3} label="Earned past 24-hours">Test</Descriptions.Item>
        <Descriptions.Item span={3} label="Paper gains">Test</Descriptions.Item>
        <Descriptions.Item span={3} label="Current leverage">Test</Descriptions.Item>
        <Descriptions.Item span={3} label="Open position">Test</Descriptions.Item>
        <Descriptions.Item span={3} label="Liquidation price">Test</Descriptions.Item>
        <Descriptions.Item span={3} label="Ave. entry price">Test</Descriptions.Item>
        <Descriptions.Item span={3} label="Balance">Test</Descriptions.Item>
        <Descriptions.Item span={3} label="Note">Test</Descriptions.Item>
      </Descriptions>
      <Chart height="50%" options={opt} data={data} />
    </Card>
  )
}