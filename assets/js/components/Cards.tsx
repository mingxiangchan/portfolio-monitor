import React from 'react'
import {Card, Descriptions, Spin} from 'antd'
import {BitmexAcc} from '../types';
import CardChart from './CardChart';


export default ({acc}: {acc: BitmexAcc}) => {
  const queriedAtLeastOnce = !!acc.wallet_balance_now
  const rsi = (acc.wallet_balance_now - acc.deposit_btc) / (10 ** 8)
  const usdBalance = rsi * acc.lastPrice
  const leverage = Math.abs((acc.currentQty / (acc.marginBalance ? acc.marginBalance : acc.margin_balance)) * (10 ** 4))
  const formatBTC = (amnt: number) => (amnt / (10 ** 8)).toFixed(4)


  return (
    <Spin spinning={!queriedAtLeastOnce} tip="Pending First Query">
      <Card title={acc.name}>
        <Descriptions size="small">
          <Descriptions.Item span={3} label="Return since inception">
            {(rsi / (acc.deposit_btc / (10 ** 8))).toFixed(2)}% / BTC {rsi.toFixed(8)} / USD {usdBalance ? usdBalance.toFixed(2) : <Spin />}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="Earned this month">
            {formatBTC(acc.wallet_balance_now - acc.wallet_balance_30_days)} BTC
        </Descriptions.Item>
          <Descriptions.Item span={3} label="Earned past 7-days">
            {formatBTC(acc.wallet_balance_now - acc.wallet_balance_7_days)} BTC
        </Descriptions.Item>
          <Descriptions.Item span={3} label="Earned past 24-hours">
            {formatBTC(acc.wallet_balance_now - acc.wallet_balance_1_day)} BTC
        </Descriptions.Item>
          <Descriptions.Item span={3} label="Paper gains">
            {acc.unrealisedPnl ? (acc.unrealisedPnl / (10 ** 8)).toFixed(8) : <Spin />}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="Current leverage">
            {leverage && leverage != Infinity ? leverage.toFixed(1) : <Spin />}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="Open position">
            {acc.currentQty ? acc.currentQty : <Spin />}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="Liquidation price">
            {acc.liquidationPrice ? acc.liquidationPrice : <Spin />}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="Ave. entry price">
            Test
</Descriptions.Item>
          <Descriptions.Item span={3} label="Balance">
            {(acc.wallet_balance_now / (10 ** 8)).toFixed(4)}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="Note">{acc.notes}</Descriptions.Item>
        </Descriptions>
        <CardChart acc={acc} />
      </Card>
    </Spin>
  )
}
