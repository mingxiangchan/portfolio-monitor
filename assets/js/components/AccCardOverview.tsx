import React from 'react'
import { Card, Row, Col, Typography, Descriptions } from 'antd'
import { BitmexAcc } from '../types'

const { Title, Paragraph } = Typography

interface PropTypes {
  acc: BitmexAcc
  btcBalance: number
  usdBalance: number
  livePrice: number
}

const AccCardOverview = ({
  acc,
  btcBalance,
  usdBalance,
  livePrice,
}: PropTypes) => {
  const leverage = Math.abs(acc.currentQty / usdBalance).toFixed(2)
  const liquidationDistanceAbs = acc.liquidationPrice - livePrice
  const liquidationDistancePer = (
    (liquidationDistanceAbs / acc.liquidationPrice) *
    100
  ).toFixed(2)
  return (
    <Card>
      <Row>
        <Col span={24}>
          <Title level={4} style={{ textAlign: 'center' }}>
            USD {usdBalance.toFixed(2)} / BTC {btcBalance}
          </Title>
          <p style={{ textAlign: 'right' }}>Balance</p>
        </Col>
      </Row>
      <Row>
        <Col span={16}>
          <Title level={4} style={{ textAlign: 'center' }}>
            {acc.currentQty} / BTC {(acc.currentQty / livePrice).toFixed(4)}
          </Title>
          <p style={{ textAlign: 'right' }}>Open Position</p>
        </Col>
        <Col span={8}>
          <Title level={4} style={{ textAlign: 'center' }}>
            {leverage}x
          </Title>
          <p style={{ textAlign: 'right' }}>Leverage</p>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Descriptions column={1}>
            <Descriptions.Item label="Liquidation">
              {acc.liquidationPrice} / {liquidationDistanceAbs} /{' '}
              {liquidationDistancePer} %
            </Descriptions.Item>
            <Descriptions.Item label="Avg Entry Price">
              USD {acc.avgEntryPrice}
            </Descriptions.Item>
            <Descriptions.Item label="Notes">
              <Paragraph ellipsis={{ rows: 2, expandable: true }}>
                {acc.notes ? acc.notes : 'NA'}
              </Paragraph>
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </Card>
  )
}

export default AccCardOverview
