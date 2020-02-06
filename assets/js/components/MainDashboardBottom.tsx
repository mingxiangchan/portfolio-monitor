import React, {useState} from 'react'
import Chart from './Chart'
import Cards from './Cards'
import {List, Row} from 'antd'

const data = {
  labels: ['1', '2', '3', '4', '5'],
  datasets: [
    {
      label: 'First',
      data: [1, 2, 3, 4, 5],
      fill: false,
      yAxisID: "f",
      borderColor: 'gold',
      pointBackgroundColor: 'gold'
    },
    {
      label: 'Second',
      data: [50, 100, 25, 1000, 1250],
      fill: false,
      yAxisID: "s",
      borderColor: 'blue',
      pointBackgroundColor: 'blue'
    }
  ]
}

export default () => {

  const [cards, useCards] = useState([{}, {}, {}, {}, {}])

  const genCardGroup = () => {
    let groups = []
    let cardsCopy = [...cards]
    cardsCopy = cardsCopy.map((item) => (
      <Cards style={{width: '30%', backgroundColor: '#e6e6e6'}} title="Mock" data={data} />
    ))
    for (let i = 0; i < (cardsCopy.length % 3 ? (Math.floor(cardsCopy.length / 3) + 1) : (Math.floor(cardsCopy.length / 3))); i++) {
      groups.push(cardsCopy.slice(0 + (i * 3), 3 + (i * 3)))
    }
    return groups
  }

  return (
    <div style={{width: "100%"}}>
      <List itemLayout="horizontal" size="large" pagination={{pageSize: 1}} dataSource={genCardGroup()} renderItem={(item, idx) => (
        <Row type="flex" justify="space-around" key={`row-${idx}`}>{item}</Row>
      )} />
    </div>
  )
}
