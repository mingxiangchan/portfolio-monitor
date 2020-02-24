import React from 'react'
import { Card, Row, Col, Typography, Descriptions } from 'antd'
import { BitmexAcc } from '../types'
import { centsToFiat } from '../utils/priceFormat'

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

  const lPrice = centsToFiat(acc.liquidationPrice)
  const lDistanceAbs = centsToFiat(acc.liquidationPrice - livePrice)
  const lDistancePer = (lDistanceAbs / centsToFiat(livePrice)) * 100

  const liquidationPriceSection =
    isLoaded(acc.liquidationPrice) && isLoaded(livePrice) ? (
      <>
        USD {lPrice} / {lDistanceAbs} / {lDistancePer.toFixed(2)} %
      </>
    ) : (
      <>
        {spinner} / {spinner} / {spinner} %
      </>
    )

  const avgEntryPrice = isLoaded(acc.avgEntryPrice)
    ? `USD ${centsToFiat(acc.avgEntryPrice)}`
    : spinner

  const notes = isLoaded(acc.notes) ? acc.notes : spinner

  return (
    <Card>
      <Row>
        <Col span={24}>
          <Paragraph strong style={{ fontSize: '18px', textAlign: 'center' }}>
            USD {centsToFiat(usdBalance).toFixed(2)} / BTC {btcBalance}
          </Paragraph>
          <p style={{ textAlign: 'right' }}>Balance</p>
        </Col>
      </Row>
      <Row>
        <Col span={16}>
          <Paragraph strong style={{ fontSize: '18px', textAlign: 'center' }}>
            {openPos}
          </Paragraph>
          <p style={{ textAlign: 'right' }}>Open Position</p>
        </Col>
        <Col span={8}>
          <Paragraph strong style={{ fontSize: '18px', textAlign: 'center' }}>
            {leverage}
          </Paragraph>
          <p style={{ textAlign: 'right' }}>Leverage</p>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Descriptions column={1}>
            <Descriptions.Item label="Liquidation">
              {liquidationPriceSection}
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
