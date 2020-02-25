import React from 'react'
import { Card, Row, Col, Typography, Descriptions } from 'antd'
import { BitmexAcc } from '../types'

const { Paragraph, Text } = Typography

interface PropTypes {
  acc: BitmexAcc
}

const spinner = <Text disabled>NA</Text>

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
      <Row>
        <Col span={24}>
          <Paragraph strong style={{ fontSize: '18px', textAlign: 'center' }}>
            USD {fiatBalance.toFixed(2)} / BTC {btcBalance}
          </Paragraph>
          <p style={{ textAlign: 'right' }}>Balance</p>
        </Col>
      </Row>
      <Row>
        <Col span={16}>
          <Paragraph strong style={{ fontSize: '18px', textAlign: 'center' }}>
            {openPos ? openPos : spinner} /{' '}
            {openPosBtc ? `BTC ${openPosBtc.toFixed(4)}` : spinner}
          </Paragraph>
          <p style={{ textAlign: 'right' }}>Open Position</p>
        </Col>
        <Col span={8}>
          <Paragraph strong style={{ fontSize: '18px', textAlign: 'center' }}>
            {leverage ? leverage.toFixed(2) : spinner} x
          </Paragraph>
          <p style={{ textAlign: 'right' }}>Leverage</p>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Descriptions column={1}>
            <Descriptions.Item label="Liquidation">
              {liquidationPrice ? `USD ${liquidationPrice}` : spinner} /{' '}
              {liquidationDistanceAbs ? liquidationDistanceAbs : spinner} /{' '}
              {liquidationDistancePer
                ? liquidationDistancePer.toFixed(2)
                : spinner}{' '}
              %
            </Descriptions.Item>
            <Descriptions.Item label="Avg Entry Price">
              {acc.avgEntryPrice ? `USD ${acc.avgEntryPrice}` : spinner}
            </Descriptions.Item>
            <Descriptions.Item label="Notes">
              <Paragraph ellipsis={{ rows: 2, expandable: true }}>
                {acc.notes ? acc.notes : spinner}
              </Paragraph>
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </>
  )
}

export default AccCardOverview
