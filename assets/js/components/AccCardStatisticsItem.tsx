import React from 'react'
import { Statistic, Icon } from 'antd'
import { StatisticType } from '../types'

interface PropTypes {
  stats: StatisticType
}

const AccCardStatisticsItem = ({ stats }: PropTypes) => (
  <>
    <Statistic
      value={stats.percentValue}
      precision={2}
      suffix="%"
      valueStyle={
        stats.absoluteValue >= 0 ? { color: '#3f8600' } : { color: '#cf1322' }
      }
      prefix={
        stats.absoluteValue >= 0 ? (
          <Icon type="arrow-up" />
        ) : (
          <Icon type="arrow-down" />
        )
      }
    />
    <p className="stat-subtitle">
      {stats.absoluteValue >= 0} {stats.symbol}{' '}
      {stats.absoluteValue.toFixed(stats.precision)}
    </p>
  </>
)

export default AccCardStatisticsItem
