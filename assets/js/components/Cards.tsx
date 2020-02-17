import React, {useContext} from 'react'
import {Card, Descriptions, Spin, Tag, } from 'antd'
import {BitmexAcc} from '../types';
import CardChart from './CardChart';
import {formatEarnings, formatBTC} from '../utils/priceFormat'
import AccUpdateModal from './AccUpdateModal'
import BitmexContext from '../context/BitmexContext';
import DashboardContext from '../context/DashboardContext';
import AccDeleteButton from './AccDeleteButton';

export default ({acc}: {acc: BitmexAcc}) => {
  const {testPrice, realPrice} = useContext(BitmexContext)
  const {testnet} = useContext(DashboardContext)
  const marginBalance = acc.marginBalance ? acc.marginBalance : acc.margin_balance
  const livePrice = testnet ? testPrice : realPrice
  const pendingFirstQuery = acc.historical_data.length === 0
  const fiatBalance = (marginBalance / (10 ** 8)) * livePrice
  const leverage = Math.abs((acc.currentQty / fiatBalance))

  return (
    <Card
      title={acc.name}
      extra={<AccUpdateModal acc={acc} />}
      actions={[<AccDeleteButton acc={acc} />]}
    >
      {acc.is_testnet ? <Tag>Test</Tag> : <Tag>Live</Tag>}
      {pendingFirstQuery ? <Tag color="blue">Pending First Query</Tag> : null}
      {acc.detected_invalid ? <Tag color="red">Invalid Credentials</Tag> : null}
      <Descriptions size="small">
        <Descriptions.Item span={3} label="Return since inception">
          {formatEarnings(acc.deposit_btc, marginBalance, acc.deposit_usd, livePrice)}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Earned this month">
          {formatEarnings(acc.wallet_balance_30_days, marginBalance, formatBTC(acc.wallet_balance_30_days) * acc.btc_price_30_days , livePrice)}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Earned past 7-days">
          {formatEarnings(acc.wallet_balance_7_days, marginBalance, formatBTC(acc.wallet_balance_7_days) * acc.btc_price_7_days, livePrice)}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Earned past 24-hours">
          {formatEarnings(acc.wallet_balance_1_day, marginBalance, formatBTC(acc.wallet_balance_1_day) * acc.btc_price_1_day, livePrice)}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Paper gains">
          {acc.unrealisedPnl ? (acc.unrealisedPnl / (10 ** 8)).toFixed(8) : <Spin />}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Current leverage">
          {leverage && leverage != Infinity ? leverage.toFixed(2) : <Spin />}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Open position">
          {acc.currentQty ? acc.currentQty : <Spin />}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Liquidation price">
          {acc.liquidationPrice ? acc.liquidationPrice : <Spin />}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Ave. entry price">
          {acc.avgEntryPrice ? acc.avgEntryPrice : acc.avg_entry_price ? acc.avg_entry_price : "0"}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Balance(BTC)">
          {marginBalance ? (marginBalance / (10 ** 8)).toFixed(4) : <Spin />}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Balance(USD)">
          {fiatBalance ? (fiatBalance).toFixed(2) : <Spin />}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Note">{acc.notes}</Descriptions.Item>
      </Descriptions>
      <CardChart acc={acc} />
    </Card>
  )
}
