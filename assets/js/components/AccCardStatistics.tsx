import React, { useState } from 'react'
import { Card, Menu, Icon, Dropdown, Row, Col } from 'antd'
import { BitmexAcc, StatisticType } from '../types'
import AccCardStatisticsItem from './AccCardStatisticsItem'

const ranges = [
  'Since Inception',
  'Since This Month',
  'Since This Week',
  'Since Yesterday',
]

interface PropTypes {
  acc: BitmexAcc
  livePrice: number
}

const AccCardStatistics = ({ acc }: PropTypes) => {
  const [selectedRange, setRange] = useState(ranges[0])
  const btcStats: StatisticType = { symbol: 'BTC' }
  const usdStats: StatisticType = { symbol: 'USD' }

  if (selectedRange === 'Since Inception') {
  } else if (selectedRange === 'Since This Month') {
  } else if (selectedRange === 'Since This Week') {
  } else if (selectedRange === 'Since Yesterday') {
  }

  const menu = (
    <Menu>
      {ranges.map(range => (
        <Menu.Item key={range}>
          <a
            onClick={e => {
              e.preventDefault()
              setRange(range)
            }}
          >
            {range}
          </a>
        </Menu.Item>
      ))}
    </Menu>
  )

  return (
    <Card>
      <Dropdown overlay={menu}>
        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
          {selectedRange}
          <Icon type="down" />
        </a>
      </Dropdown>
      <Row gutter={16}>
        <Col span={12}>
          <AccCardStatisticsItem stats={usdStats} />
        </Col>
        <Col span={12}>
          <AccCardStatisticsItem stats={btcStats} />
        </Col>
      </Row>
    </Card>
  )
}

export default AccCardStatistics
