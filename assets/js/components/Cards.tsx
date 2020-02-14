import React, {useContext} from 'react'
import {Card, Descriptions, Spin, Tag, } from 'antd'
import {BitmexAcc} from '../types';
import CardChart from './CardChart';
import {formatEarnings} from '../utils/priceFormat'
import AccUpdateModal from './AccUpdateModal'
import BitmexContext from '../context/BitmexContext';
import DashboardContext from '../context/DashboardContext';


export default ({acc}: {acc: BitmexAcc}) => {
  const {testPrice, realPrice} = useContext(BitmexContext)
  const {testnet} = useContext(DashboardContext)
  const leverage = Math.abs((acc.currentQty / (acc.marginBalance ? acc.marginBalance : acc.margin_balance)) * (10 ** 4))
  const livePrice = testnet ? testPrice : realPrice
  const lastPrice = acc.lastPrice !== undefined ? acc.lastPrice : livePrice
  const pendingFirstQuery = acc.historical_data.length === 0
  const marginBalance = acc.marginBalance ? acc.marginBalance: acc.margin_balance
  const fiatBalance = (marginBalance / (10 ** 8)) * lastPrice

  const closestDay = acc.wallet_balance_1_day ? acc.wallet_balance_1_day: acc.deposit_btc
  const closest7 = acc.wallet_balance_7_days ? acc.wallet_balance_7_days : closestDay
  const closest30 = 
  acc.wallet_balance_30_days ? acc.wallet_balance_30_days : closest7

  return (
    <Card title={acc.name} extra={<AccUpdateModal acc={acc} />}>
      {acc.is_testnet ? <Tag>Test</Tag> : <Tag>Live</Tag>}
      {pendingFirstQuery ? <Tag color="blue">Pending First Query</Tag> : null}
      {acc.detected_invalid ? <Tag color="red">Invalid Credentials</Tag> : null}
      <Descriptions size="small">
        <Descriptions.Item span={3} label="Return since inception">
          {formatEarnings(acc.deposit_btc, acc.wallet_balance_now, lastPrice)}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Earned this month">
          {formatEarnings(closest30, acc.wallet_balance_now, lastPrice)}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Earned past 7-days">
          {formatEarnings(closest7, acc.wallet_balance_now, lastPrice)}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Earned past 24-hours">
          {formatEarnings(closestDay, acc.wallet_balance_now, lastPrice)}
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
          {marginBalance ? (marginBalance / (10 ** 8)).toFixed(4) : <Spin/>}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Balance(USD)">
          {fiatBalance ? (fiatBalance).toFixed(2) : <Spin/> }
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Note">{acc.notes}</Descriptions.Item>
      </Descriptions>
      <CardChart acc={acc} />
    </Card>
  )
}
