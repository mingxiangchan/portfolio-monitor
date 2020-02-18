import React, { useContext } from 'react'
import { Card, Descriptions, Row, Col } from 'antd'
import { BitmexAcc } from '../types'
import { formatEarnings } from '../utils/priceFormat'
import BitmexContext from '../context/BitmexContext'
import DashboardContext from '../context/DashboardContext'
import CummulativeChart from './CummulativeChart'

interface PropTypes {
  accs: BitmexAcc[]
}

const MainDashboardTop: React.FunctionComponent<PropTypes> = ({
  accs,
}: PropTypes) => {
  const { testPrice, realPrice } = useContext(BitmexContext)
  const { testnet } = useContext(DashboardContext)

  const price = testnet ? testPrice : realPrice

  let entryCount = 0
  let pnl = 0
  let qty = 0
  let balance = 0
  let start = 0
  let mBalance = 0
  let liqPrice = 0
  let liqPriceGap = Infinity
  let liqAcc = null
  let price30 = 0
  let price7 = 0
  let priceDay = 0
  let entry = 0
  let cFiatBal1 = 0
  let cFiatBal7 = 0
  let cFiatBal30 = 0
  let startUSD = 0

  for (const acc of accs) {
    const {
      wallet_balance_30_days,
      wallet_balance_7_days,
      wallet_balance_1_day,
      wallet_balance_now,
      deposit_btc,
      deposit_usd,
      currentQty,
      marginBalance,
      unrealisedPnl,
      liquidationPrice,
      avgEntryPrice,
      avg_entry_price,
      name,
      fiatBal1,
      fiatBal7,
      fiatBal30,
    } = acc

    const currentLiqPriceGap =
      liquidationPrice && price
        ? Math.abs(liquidationPrice - price)
        : liqPriceGap
    const smallerLiqPrice = currentLiqPriceGap < liqPriceGap
    const entryPrice = avgEntryPrice
      ? avgEntryPrice
      : avg_entry_price
      ? parseFloat(avg_entry_price)
      : 0

    mBalance = mBalance + (marginBalance ? marginBalance : acc.margin_balance)
    pnl = unrealisedPnl ? pnl + unrealisedPnl : pnl
    qty = currentQty ? qty + currentQty : qty
    balance = balance + wallet_balance_now
    start = start + deposit_btc
    startUSD = startUSD + deposit_usd / 100
    liqPrice = smallerLiqPrice ? liquidationPrice : liqPrice
    liqPriceGap = smallerLiqPrice ? currentLiqPriceGap : liqPriceGap
    priceDay = priceDay + wallet_balance_1_day
    price7 = price7 + wallet_balance_7_days
    price30 = price30 + wallet_balance_30_days
    cFiatBal1 = cFiatBal1 + fiatBal1
    cFiatBal7 = cFiatBal7 + fiatBal7
    cFiatBal30 = cFiatBal30 + fiatBal30
    entry = entry + entryPrice
    liqAcc = smallerLiqPrice ? name : liqAcc
    entryCount = entryCount + (entryPrice ? 1 : 0)
  }

  const fiatBalance = (mBalance / 10 ** 8) * price
  const leverage = Math.abs(qty / fiatBalance)

  return (
    <Row
      type="flex"
      style={{
        width: '100%',
        borderBottom: '1px solid #383838',
        paddingBottom: '5px',
        marginBottom: '5px',
        maxHeight: '45vh',
      }}
    >
      <Card>
        <Col span={11}>
          <CummulativeChart
            accs={accs}
            livePrice={price}
            cummulativeBalance={balance}
          />
        </Col>
        <Col span={12} offset={1}>
          <Descriptions
            column={{ md: 1, lg: 2 }}
            size="small"
            title="Cumulative"
          >
            <Descriptions.Item label="Return since inception">
              {formatEarnings(start, mBalance, startUSD, price)}
            </Descriptions.Item>
            <Descriptions.Item label="Earned this month">
              {formatEarnings(price30, mBalance, cFiatBal30, price)}
            </Descriptions.Item>
            <Descriptions.Item label="Earned past 7-days">
              {formatEarnings(price7, mBalance, cFiatBal7, price)}
            </Descriptions.Item>
            <Descriptions.Item label="Earned past 24-hours">
              {formatEarnings(priceDay, mBalance, cFiatBal1, price)}
            </Descriptions.Item>
            <Descriptions.Item label="Paper gains">
              {pnl ? (pnl / 10 ** 8).toFixed(8) : 'NA'}
            </Descriptions.Item>
            <Descriptions.Item label="Current leverage">
              {leverage && leverage != Infinity ? leverage.toFixed(2) : 0}
            </Descriptions.Item>
            <Descriptions.Item label="Open position">{qty}</Descriptions.Item>
            <Descriptions.Item label="Nearest liquidation price">
              {liqAcc == null ? 'NA' : liqPrice + ` (${liqAcc})`}
            </Descriptions.Item>
            <Descriptions.Item label="Ave. entry price">
              {entryCount ? entry / entryCount : 'NA'}
            </Descriptions.Item>
            <Descriptions.Item label="Balance(BTC)">
              {(mBalance / 10 ** 8).toFixed(4)}
            </Descriptions.Item>
            <Descriptions.Item label="Balance(USD)">
              {((mBalance / 10 ** 8) * price).toFixed(2)}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Card>
    </Row>
  )
}

export default MainDashboardTop
