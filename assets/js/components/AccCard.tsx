import React from 'react'
import { Typography, List, Icon, Row, Col, Card, Tag } from 'antd'
import { AccPropTypes } from '../types'
import CardChart from './CardChart'
import AccUpdateModal from './AccUpdateModal'
import AccDeleteButton from './AccDeleteButton'
import AccCardStatistics from './AccCardStatistics'
import AccCardOverview from './AccCardOverview'

const { Title } = Typography

const AccCard = ({ acc }: AccPropTypes) => {
  return (
    <List.Item
      actions={[
        <Icon type="edit" key="edit" />,
        <Icon type="delete" key="delete" />,
      ]}
      extra={
        <Row>
          <Col span={12}>
            <AccCardOverview acc={acc} />
          </Col>
          <Col span={12}>
            <CardChart acc={acc} />
          </Col>
        </Row>
      }
    >
      <List.Item.Meta title={acc.name} />
      <Col span={12}>
        {acc.is_testnet ? <Tag>Test</Tag> : <Tag>Live</Tag>}
        {acc.pendingFirstQuery ? (
          <Tag color="blue">Pending First Query</Tag>
        ) : null}
        {acc.detected_invalid ? (
          <Tag color="red">Invalid Credentials</Tag>
        ) : null}
        <AccCardStatistics acc={acc} />
      </Col>
    </List.Item>
  )
}

export default AccCard
