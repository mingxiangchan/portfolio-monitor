import React from 'react'
import Chart from '../../components/Chart'
import {Card} from 'antd'

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
  },
  maintainAspectRatio: false
}

export default () => {
	return (
    <div style={{width: "100%", borderBottom: "1px solid #383838", display: 'flex'}}>
      <Chart width="50%" data={data} options={opt}/>
      <Card title="Cummulative" style={{flexGrow: 1, marginLeft: '10px'}}>
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
      </Card>
    </div>
  )
}