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
  btcBalance: number
  usdBalance: number
}

const calcEarnings = (
  stats: StatisticType,
  currentVal: number,
  pastVal: number,
) => {
  stats.absoluteValue = currentVal - pastVal
  stats.percentValue = stats.absoluteValue / pastVal / 100
  stats.isPositive = stats.absoluteValue >= 0
  return stats
}

const AccCardStatistics = ({ acc, btcBalance, usdBalance }: PropTypes) => {
  const [selectedRange, setRange] = useState(ranges[0])
  let btcStats: StatisticType = { symbol: 'BTC', precision: 8 }
  let usdStats: StatisticType = { symbol: 'USD', precision: 2 }

  if (selectedRange === 'Since Inception') {
    btcStats = calcEarnings(btcStats, btcBalance, acc.deposit_btc)
    usdStats = calcEarnings(usdStats, usdBalance, acc.deposit_usd)
  } else if (selectedRange === 'Since This Month') {
    btcStats = calcEarnings(btcStats, btcBalance, acc.wallet_balance_30_days)
    usdStats = calcEarnings(usdStats, usdBalance, acc.fiatBal30)
  } else if (selectedRange === 'Since This Week') {
    btcStats = calcEarnings(btcStats, btcBalance, acc.wallet_balance_7_days)
    usdStats = calcEarnings(usdStats, usdBalance, acc.fiatBal7)
  } else if (selectedRange === 'Since Yesterday') {
    btcStats = calcEarnings(btcStats, btcBalance, acc.wallet_balance_1_day)
    usdStats = calcEarnings(usdStats, usdBalance, acc.fiatBal1)
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
