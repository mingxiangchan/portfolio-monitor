import React, { useState } from 'react'
import { Card, Menu, Icon, Dropdown, Row, Col } from 'antd'
import { Earnings, BitmexAcc } from '../types'
import AccCardStatisticsItem from './AccCardStatisticsItem'

const ranges = {
  'Since Inception': 'earningsInception',
  'Since This Month': 'earnings1day',
  'Since This Week': 'earnings7days',
  'Since Yesterday': 'earnings30days',
}

interface PropTypes {
  acc: BitmexAcc
}

const AccCardStatistics = ({ acc }: PropTypes) => {
  const initialRange = Object.keys(ranges)[0]
  const [selectedRange, setRange] = useState(initialRange)

  const propertyName = ranges[selectedRange]
  const stats: Earnings = acc.calculated[propertyName]

  const menu = (
    <Menu>
      {Object.keys(ranges).map(range => (
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
    <Card style={{ marginTop: '5px', marginBottom: '5px' }}>
      <Dropdown overlay={menu}>
        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
          {selectedRange}
          <Icon type="down" />
        </a>
      </Dropdown>
      <Row gutter={16}>
        <Col span={12}>
          <AccCardStatisticsItem stats={stats.fiat} />
        </Col>
        <Col span={12}>
          <AccCardStatisticsItem stats={stats.btc} />
        </Col>
      </Row>
    </Card>
  )
}

export default AccCardStatistics
