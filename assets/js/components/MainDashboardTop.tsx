import React, { useContext } from 'react'
import { Card, Descriptions, Row, Col } from 'antd'
import { BitmexAcc } from '../types'
import { formatEarnings } from '../utils/priceFormat'
import { BitmexContext } from '../context/BitmexContext'
import { DashboardContext } from '../context/DashboardContext'
import CummulativeChart from './CummulativeChart'
import { satToBtc, centsToFiat } from '../utils/priceFormat'
import ValueWithLabel from './ValueWithLabel'

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
      gutter={[8, 8]}
      type="flex"
      style={{
        width: '100%',
        paddingBottom: '5px',
        marginBottom: '5px',
      }}
    >
      <Col md={10} style={{ flexGrow: 1 }}>
        <Card style={{ height: '100%', width: '100%' }}>
          <CummulativeChart
            accs={accs}
            livePrice={price}
            cummulativeBalance={balance}
          />
        </Card>
      </Col>
      <Col md={14} style={{ flexGrow: 1 }}>
        <Card type="inner" title="Cumulative" style={{ height: '100%' }}>
          <Row gutter={[0, 0]}>
            <Col md={8} lg={6}>
              <ValueWithLabel
                small
                value={satToBtc(pnl).toFixed(8)}
                title="Paper gains"
              />
            </Col>
            <Col md={8} lg={6}>
              <ValueWithLabel
                small
                value={
                  leverage && leverage != Infinity ? leverage.toFixed(2) : 0
                }
                title="Current leverage"
              />
            </Col>
            <Col md={8} lg={6}>
              <ValueWithLabel value={qty} title="Open position" />
            </Col>
            <Col md={8} lg={6}>
              <ValueWithLabel
                value={
                  liqAcc == null
                    ? 'NaN'
                    : centsToFiat(liqPrice) + ` (${liqAcc})`
                }
                title="Nearest liquidation price"
              />
            </Col>
            <Col md={8} lg={6}>
              <ValueWithLabel
                value={entryCount ? centsToFiat(entry / entryCount) : 'NaN'}
                title="Ave. entry price"
              />
            </Col>
            <Col md={8} lg={6}>
              <ValueWithLabel
                value={satToBtc(mBalance).toFixed(4)}
                title="Balance(BTC)"
              />
            </Col>
            <Col md={8} lg={6}>
              <ValueWithLabel
                value={centsToFiat(satToBtc(mBalance) * price).toFixed(2)}
                title="Balance(USD)"
              />
            </Col>
          </Row>
          <Row gutter={[0, 0]}>
            <Col lg={12}>
              <ValueWithLabel
                small
                value={formatEarnings(startBtc, mBalance, startFiat, price)}
                title="Return since inception"
              />
            </Col>
            <Col lg={12}>
              <ValueWithLabel
                small
                value={formatEarnings(price30, mBalance, cFiatBal30, price)}
                title="Earned this month"
              />
            </Col>
            <Col lg={12}>
              <ValueWithLabel
                small
                value={formatEarnings(price7, mBalance, cFiatBal7, price)}
                title="Earned past 7-days"
              />
            </Col>
            <Col lg={12}>
              <ValueWithLabel
                small
                value={formatEarnings(priceDay, mBalance, cFiatBal1, price)}
                title="Earned past 24-hours"
              />
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  )
}

export default MainDashboardTop
