import React, { useState } from 'react'
import { Card, Menu, Icon, Dropdown, Row, Col } from 'antd'
import { BitmexAcc, StatisticType, HistoricalData } from '../types'
import AccCardStatisticsItem from './AccCardStatisticsItem'
import { satToBtc, centsToFiat } from '../utils/priceFormat'

const ranges = [
  'Since Inception',
  'Since This Month',
  'Since This Week',
  'Since Yesterday',
]

interface PropTypes {
  acc: BitmexAcc
  btcBalance: number
  usdBalance: number
}

const calcEarnings = (
  stats: StatisticType,
  currentVal: number,
  pastVal: number,
) => {
  stats.absoluteValue = currentVal - pastVal
  stats.percentValue = (stats.absoluteValue / pastVal) * 100
  stats.isPositive = stats.absoluteValue >= 0

  return stats
}

const AccCardStatistics = ({ acc, btcBalance, usdBalance }: PropTypes) => {
  const [selectedRange, setRange] = useState(ranges[0])
  let btcStats: StatisticType = { symbol: 'BTC', precision: 8 }
  let usdStats: StatisticType = { symbol: 'USD', precision: 2 }

  // server side results are in cents
  let history: HistoricalData
  if (selectedRange === 'Since Inception') {
    history = acc.historical_data[0]
  } else if (selectedRange === 'Since This Month') {
    history = acc.balance30days
  } else if (selectedRange === 'Since This Week') {
    history = acc.balance7days
  } else if (selectedRange === 'Since Yesterday') {
    history = acc.balance1day
  }

  btcStats = calcEarnings(
    btcStats,
    btcBalance,
    satToBtc(history.wallet_balance_btc),
  )
  usdStats = calcEarnings(
    usdStats,
    centsToFiat(usdBalance),
    centsToFiat(history.wallet_balance_usd),
  )

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
    <Card style={{ marginTop: '5px', marginBottom: '5px' }}>
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
