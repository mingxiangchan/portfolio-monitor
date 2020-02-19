import React from 'react'
import { Card, Row, Col, Typography, Descriptions } from 'antd'

const { Title, Paragraph } = Typography

const AccCardOverview = () => {
  return (
    <Card>
      <Row>
        <Col span={24}>
          <Title level={4} style={{ textAlign: 'center' }}>
            USD 11,500 / BTC 1.419
          </Title>
          <p style={{ textAlign: 'right' }}>Balance</p>
        </Col>
      </Row>
      <Row>
        <Col span={16}>
          <Title level={4} style={{ textAlign: 'center' }}>
            8100 / BTC 1.501
          </Title>
          <p style={{ textAlign: 'right' }}>Open Position</p>
        </Col>
        <Col span={8}>
          <Title level={4} style={{ textAlign: 'center' }}>
            0.81x
          </Title>
          <p style={{ textAlign: 'right' }}>Leverage</p>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Descriptions column={1}>
            <Descriptions.Item label="Liquidation">
              4621.5 / -4823 / - 51%
            </Descriptions.Item>
            <Descriptions.Item label="Avg Entry Price">
              USD 7,600
            </Descriptions.Item>
            <Descriptions.Item label="Notes">
              <Paragraph ellipsis={{ rows: 2, expandable: true }}>
                Testing a permanent 2x strategy from 21 Feb 8AM. Started with
                13BTC.
              </Paragraph>
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </Card>
  )
}

export default AccCardOverview
