import React, { useContext } from 'react'
import { Card, Descriptions, Tag } from 'antd'
import { AccPropTypes } from '../types'
import CardChart from './CardChart'
import { formatEarnings } from '../utils/priceFormat'
import AccUpdateModal from './AccUpdateModal'
import BitmexContext from '../context/BitmexContext'
import DashboardContext from '../context/DashboardContext'
import AccDeleteButton from './AccDeleteButton'

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
  const fiatBalance = (marginBalance / 10 ** 8) * livePrice
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
      <Descriptions size="small">
        <Descriptions.Item span={3} label="Return since inception">
          {formatEarnings(
            acc.deposit_btc,
            marginBalance,
            (acc.deposit_usd / 100).toFixed(2),
            livePrice,
          )}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Earned this month">
          {formatEarnings(
            acc.wallet_balance_30_days,
            marginBalance,
            acc.fiatBal30,
            livePrice,
          )}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Earned past 7-days">
          {formatEarnings(
            acc.wallet_balance_7_days,
            marginBalance,
            acc.fiatBal7,
            livePrice,
          )}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Earned past 24-hours">
          {formatEarnings(
            acc.wallet_balance_1_day,
            marginBalance,
            acc.fiatBal1,
            livePrice,
          )}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Paper gains">
          {acc.unrealisedPnl ? (acc.unrealisedPnl / 10 ** 8).toFixed(8) : 'NA'}
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
