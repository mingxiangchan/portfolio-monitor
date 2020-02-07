import React, {useState} from 'react'
import Chart from './Chart'
import Cards from './Cards'
import {List, Row} from 'antd'
import {BitmexAccsState} from '../types';

export default ({accs}: {accs: BitmexAccsState}) => {

  const genCardGroup = () => {
    let groups = []
    let accsCopy = Object.entries(accs)
    accsCopy = accsCopy.map((item, idx) => (
      <Cards key={idx} style={{width: '30%', backgroundColor: '#e6e6e6'}} acc={item[1]} />
    ))
    for (let i = 0; i < (accsCopy.length % 3 ? (Math.floor(accsCopy.length / 3) + 1) : (Math.floor(accsCopy.length / 3))); i++) {
      groups.push(accsCopy.slice(0 + (i * 3), 3 + (i * 3)))
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
