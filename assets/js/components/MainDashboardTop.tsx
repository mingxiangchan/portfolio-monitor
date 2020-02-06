import React from 'react'
import Chart from './Chart'
import {Card, Descriptions, Row, Col} from 'antd'

const data = {
  labels: ['1', '2', '3', '4', '5'],
  datasets: [
    {
      label: 'First',
      data: [1,2,3,4,5],
      fill: false,
      yAxisID: "f",
      borderColor: 'gold',
      pointBackgroundColor: 'gold'
    },
    {
      label: 'Second',
      data: [50,100,25,1000,1250],
      fill: false,
      yAxisID: "s",
      borderColor: 'blue',
      pointBackgroundColor: 'blue'
    }
  ]
}

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

export default () => {
	return (
    <Row type="flex" style={{width: "100%", borderBottom: "1px solid #383838", paddingBottom: '5px', marginBottom: '5px'}}>
      <Col span={11}>
        <Chart data={data} options={opt}/>
      </Col>
      <Col span={13}>
        <Card title="Cummulative" style={{flexGrow: 1, marginLeft: '10px', backgroundColor: '#e6e6e6'}}>
          <Descriptions column={{md: 1, lg: 2}}>
            <Descriptions.Item label="Return since inception">TEST</Descriptions.Item>
            <Descriptions.Item label="Earned this month">TEST</Descriptions.Item>
            <Descriptions.Item label="Earned past 7-days">TEST</Descriptions.Item>
            <Descriptions.Item label="Earned past 24-hours">TEST</Descriptions.Item>
            <Descriptions.Item label="Paper gains">TEST</Descriptions.Item>
            <Descriptions.Item label="Current leverage">TEST</Descriptions.Item>
            <Descriptions.Item label="Open position">TEST</Descriptions.Item>
            <Descriptions.Item label="Liquidation price">TEST</Descriptions.Item>
            <Descriptions.Item label="Ave. entry price">TEST</Descriptions.Item>
            <Descriptions.Item label="Balance">TEST</Descriptions.Item>
          </Descriptions>
        </Card>
      </Col>
    </Row>
  )
}