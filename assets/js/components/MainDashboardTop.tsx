import React, { useContext } from 'react'
import { Card, Descriptions, Row, Col } from 'antd'
import { BitmexAcc } from '../types'
import { formatEarnings } from '../utils/priceFormat'
import { BitmexContext } from '../context/BitmexContext'
import { DashboardContext } from '../context/DashboardContext'
import CummulativeChart from './CummulativeChart'
import { satToBtc, centsToFiat } from '../utils/priceFormat'

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
  let startBtc = 0
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
  let startFiat = 0

  for (const acc of accs) {
    const {
      deposit_btc,
      deposit_usd,
      avgEntryPrice,
      currentQty,
      marginBalance,
      walletBalance,
      unrealisedPnl,
      liquidationPrice,
      name,
    } = acc

    const currentLiqPriceGap =
      liquidationPrice && price
        ? Math.abs(liquidationPrice - price)
        : liqPriceGap
    const smallerLiqPrice = currentLiqPriceGap < liqPriceGap

    mBalance += marginBalance
    balance += walletBalance
    startBtc += deposit_btc
    startFiat += deposit_usd
    priceDay += acc.balance1day.wallet_balance_btc
    price7 += acc.balance7days.wallet_balance_btc
    price30 += acc.balance30days.wallet_balance_btc
    cFiatBal1 += acc.balance1day.wallet_balance_usd
    cFiatBal7 += acc.balance7days.wallet_balance_usd
    cFiatBal30 += acc.balance30days.wallet_balance_usd
    entry += avgEntryPrice
    entryCount += avgEntryPrice ? 1 : 0
    pnl = unrealisedPnl ? pnl + unrealisedPnl : pnl
    qty = currentQty ? qty + currentQty : qty
    liqPrice = smallerLiqPrice ? liquidationPrice : liqPrice
    liqPriceGap = smallerLiqPrice ? currentLiqPriceGap : liqPriceGap
    liqAcc = smallerLiqPrice ? name : liqAcc
  }

  const fiatBalance = mBalance * price
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
              {formatEarnings(startBtc, mBalance, startFiat, price)}
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
              {pnl ? satToBtc(pnl).toFixed(8) : 'NA'}
            </Descriptions.Item>
            <Descriptions.Item label="Current leverage">
              {leverage && leverage != Infinity ? leverage.toFixed(2) : 0}
            </Descriptions.Item>
            <Descriptions.Item label="Open position">{qty}</Descriptions.Item>
            <Descriptions.Item label="Nearest liquidation price">
              {liqAcc == null ? 'NA' : centsToFiat(liqPrice) + ` (${liqAcc})`}
            </Descriptions.Item>
            <Descriptions.Item label="Ave. entry price">
              {entryCount ? centsToFiat(entry / entryCount) : 'NA'}
            </Descriptions.Item>
            <Descriptions.Item label="Balance(BTC)">
              {satToBtc(mBalance).toFixed(4)}
            </Descriptions.Item>
            <Descriptions.Item label="Balance(USD)">
              {centsToFiat(satToBtc(mBalance) * price).toFixed(2)}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Card>
    </Row>
  )
}

export default MainDashboardTop
