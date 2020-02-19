import React, { useContext } from 'react'
import { Card, Descriptions, Tag } from 'antd'
import { AccPropTypes } from '../types'
import CardChart from './CardChart'
import AccUpdateModal from './AccUpdateModal'
import BitmexContext from '../context/BitmexContext'
import DashboardContext from '../context/DashboardContext'
import AccDeleteButton from './AccDeleteButton'
import AccCardStatistics from './AccCardStatistics'
import AccCardOverview from './AccCardOverview'

const AccCard: React.FunctionComponent<AccPropTypes> = ({
  acc,
}: AccPropTypes) => {
  const { testPrice, realPrice } = useContext(BitmexContext)
  const { testnet } = useContext(DashboardContext)
  const marginBalance = acc.marginBalance
    ? acc.marginBalance
    : acc.margin_balance
  const livePrice = testnet ? testPrice : realPrice
  const pendingFirstQuery = acc.historical_data.length === 0
  const fiatBalance = marginBalance * livePrice
  const leverage = Math.abs(acc.currentQty / fiatBalance)

  return (
    <Card
      title={acc.name}
      extra={<AccUpdateModal acc={acc} />}
      actions={[<AccDeleteButton acc={acc} key={`delete-${acc.id}`} />]}
    >
      {acc.is_testnet ? <Tag>Test</Tag> : <Tag>Live</Tag>}
      {pendingFirstQuery ? <Tag color="blue">Pending First Query</Tag> : null}
      {acc.detected_invalid ? <Tag color="red">Invalid Credentials</Tag> : null}
      <AccCardStatistics acc={acc} livePrice={livePrice} />
      <AccCardOverview />
      <Descriptions size="small">
        <Descriptions.Item span={3} label="Paper gains">
          {acc.unrealisedPnl ? acc.unrealisedPnl.toFixed(8) : 'NA'}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Current leverage">
          {leverage && leverage != Infinity ? leverage.toFixed(2) : 0}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Open position">
          {acc.currentQty ? acc.currentQty : 0}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Liquidation price">
          {acc.liquidationPrice ? acc.liquidationPrice : 'NA'}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Ave. entry price">
          {acc.avgEntryPrice
            ? acc.avgEntryPrice
            : parseInt(acc.avg_entry_price)
            ? acc.avg_entry_price
            : 'NA'}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Balance(BTC)">
          {(marginBalance / 10 ** 8).toFixed(4)}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Balance(USD)">
          {fiatBalance.toFixed(2)}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Note">
          {acc.notes}
        </Descriptions.Item>
      </Descriptions>
      <CardChart acc={acc} />
    </Card>
  )
}

export default AccCard
