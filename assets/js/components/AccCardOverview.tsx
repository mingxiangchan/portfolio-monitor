import React from 'react'
import { Card, Row, Col, Statistic } from 'antd'
import { BitmexAcc } from '../types'

interface PropTypes {
  acc: BitmexAcc
}

const NA = '<span class="na">NA</span>'

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
    <Card className="overview-items">
      <Statistic
        title="Balance"
        value={`USD ${fiatBalance.toFixed(2)} / BTC ${btcBalance}`}
      />
      <Row gutter={16}>
        <Col span={9}>
          <Statistic
            formatter={value => (
              <span dangerouslySetInnerHTML={{ __html: value }} />
            )}
            title="Leverage"
            value={leverage ? leverage.toFixed(2) : NA}
          />
        </Col>
        <Col span={15}>
          <Statistic
            title="Open Position"
            formatter={value => (
              <span dangerouslySetInnerHTML={{ __html: value }} />
            )}
            value={`${openPos ? openPos : NA} / BTC ${openPosBtc.toFixed(4)}`}
          />
        </Col>
      </Row>
      <Row>
        <Col span={9}>
          <Statistic
            title="Average Entry Price"
            prefix="USD"
            value={acc.avgEntryPrice}
          />
        </Col>
        <Col span={15}>
          <Statistic
            title="Liquidation"
            value={`USD ${liquidationPrice} / ${liquidationDistanceAbs} / ${liquidationDistancePer.toFixed(
              2,
            )}%`}
          />
        </Col>
      </Row>

      {/* <Row>
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
      </Row> */}
      {/* <Row>
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
          </Descriptions>
        </Col>
      </Row> */}
    </Card>
  )
}

export default AccCardOverview
