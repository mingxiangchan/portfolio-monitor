import React from 'react'
import { Card, Row, Col } from 'antd'
import { BitmexAcc } from '../types'
import ValueWithLabel from './ValueWithLabel'
interface PropTypes {
  acc: BitmexAcc
}

const AccCardOverview = ({ acc }: PropTypes) => {
  const {
    fiatBalance,
    btcBalance,
    openPos,
    openPosBtc,
    leverage,
    liquidationPrice,
    liquidationDistanceAbs,
    liquidationDistancePer,
  } = acc.calculated

  return (
    <>
      <Card className="overview-items">
        <ValueWithLabel
          title="Balance"
          value={`USD ${fiatBalance.toFixed(2)} / BTC ${btcBalance}`}
        />
        <Row>
          <Col span={9}>
            <ValueWithLabel title="Leverage" value={leverage.toFixed(2)} />
          </Col>
          <Col span={15}>
            <ValueWithLabel
              title="Open Position"
              value={`${openPos} / BTC ${openPosBtc.toFixed(4)}`}
            />
          </Col>
        </Row>
        <Row>
          <Col span={9}>
            <ValueWithLabel
              title="Average Entry Price"
              prefix="USD"
              value={acc.avgEntryPrice}
            />
          </Col>
          <Col span={15}>
            <ValueWithLabel
              title="Liquidation"
              value={`USD ${liquidationPrice} / ${liquidationDistanceAbs} / ${liquidationDistancePer.toFixed(
                2,
              )}%`}
            />
          </Col>
        </Row>
      </Card>
    </>
  )
}

export default AccCardOverview
