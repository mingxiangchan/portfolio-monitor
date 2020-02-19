import React from 'react'
import { Statistic, Icon } from 'antd'
import { StatisticType } from '../types'

interface PropTypes {
  stats: StatisticType
}

const AccCardStatisticsItem = ({ stats }: PropTypes) => (
  <>
    <Statistic
      value={stats.percentValue.toFixed(2)}
      precision={2}
      suffix="%"
      valueStyle={
        stats.isPositive ? { color: '#3f8600' } : { color: '#cf1322' }
      }
      prefix={
        stats.isPositive ? <Icon type="arrow-up" /> : <Icon type="arrow-down" />
      }
    />
    <p>
      {stats.isPositive} {stats.symbol}{' '}
      {stats.absoluteValue.toFixed(stats.precision)}
    </p>
  </>
)

export default AccCardStatisticsItem
