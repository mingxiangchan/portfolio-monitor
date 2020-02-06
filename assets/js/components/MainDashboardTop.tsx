import React from 'react'
import Chart from './Chart'
import {Card, Descriptions, Row, Col} from 'antd'
import {BitmexAcc, BitmexAccsState} from '../types';

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
    ]
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

export default ({accs}: {accs: BitmexAccsState}) => {
  let total = {}
  
  const accsArray = Object.values(accs)

  for (let i = 0; i < accsArray.length; i++) {
    const acc = accsArray[i]
    for (let y = 0; y < acc.historical_data.length; y++) {
      const history = acc.historical_data[y]
      const date = history.inserted_at
      const balance = (history.wallet_balance / (10 ** 8)).toFixed(4)
      if (total[date]) {
        total[date] += balance
      } else {
        total[date] = balance
      }
    }
  }
  
  const data = {
    labels: Object.keys(total),
    datasets: [
      {
        label: 'First',
        data: Object.values(total),
        fill: false,
        yAxisID: "btcBalance",
        borderColor: 'gold',
        pointBackgroundColor: 'gold'
      }
    ]
  }

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
            <Descriptions.Item label="Balance">{
              (Object.values(accs).reduce((total, acc) => {
                return total + acc.wallet_balance_now
              },0) / (10 ** 8)).toFixed(4)
            }</Descriptions.Item>
          </Descriptions>
        </Card>
      </Col>
    </Row>
  )
}