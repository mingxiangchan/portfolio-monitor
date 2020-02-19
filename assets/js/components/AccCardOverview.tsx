import React from 'react'
import { Card, Row, Col, Typography, Descriptions, Icon } from 'antd'
import { BitmexAcc } from '../types'

const { Title, Paragraph, Text } = Typography

interface PropTypes {
  acc: BitmexAcc
  btcBalance: number
  usdBalance: number
  livePrice: number
}

const isLoaded = (val): boolean => val !== null && val !== undefined

const spinner = <Text disabled>NA</Text>

const AccCardOverview = ({
  acc,
  btcBalance,
  usdBalance,
  livePrice,
}: PropTypes) => {
  const openPos = isLoaded(acc.currentQty)
    ? `${acc.currentQty} / BTC ${(acc.currentQty / livePrice).toFixed(4)}`
    : spinner

  const leverage =
    isLoaded(acc.currentQty) && isLoaded(usdBalance)
      ? `${Math.abs(acc.currentQty / usdBalance).toFixed(2)}x`
      : spinner

  const liquidationPrice = isLoaded(acc.liquidationPrice)
    ? `USD ${acc.liquidationPrice} `
    : spinner

  const liquidationDistanceAbs =
    isLoaded(acc.liquidationPrice) && isLoaded(livePrice)
      ? acc.liquidationPrice - livePrice
      : spinner

  const liquidationDistancePer =
    isLoaded(acc.liquidationPrice) && isLoaded(livePrice)
      ? ((liquidationDistanceAbs / acc.liquidationPrice) * 100).toFixed(2)
      : spinner

  const avgEntryPrice = isLoaded(acc.avgEntryPrice)
    ? `USD ${acc.avgEntryPrice}`
    : spinner

  const notes = isLoaded(acc.notes) ? acc.notes : spinner

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
            {openPos}
          </Title>
          <p style={{ textAlign: 'right' }}>Open Position</p>
        </Col>
        <Col span={8}>
          <Title level={4} style={{ textAlign: 'center' }}>
            {leverage}
          </Title>
          <p style={{ textAlign: 'right' }}>Leverage</p>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Descriptions column={1}>
            <Descriptions.Item label="Liquidation">
              {liquidationPrice} / {liquidationDistanceAbs} /{' '}
              {liquidationDistancePer} %
            </Descriptions.Item>
            <Descriptions.Item label="Avg Entry Price">
              {avgEntryPrice}
            </Descriptions.Item>
            <Descriptions.Item label="Notes">
              <Paragraph ellipsis={{ rows: 2, expandable: true }}>
                {notes}
              </Paragraph>
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </Card>
  )
}

export default AccCardOverview
