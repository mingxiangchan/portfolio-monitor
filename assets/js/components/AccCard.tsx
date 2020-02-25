import React from 'react'
import { Card, Tag, Typography } from 'antd'
import { AccPropTypes } from '../types'
import CardChart from './CardChart'
import AccUpdateModal from './AccUpdateModal'
import AccDeleteButton from './AccDeleteButton'
import AccCardStatistics from './AccCardStatistics'
import AccCardOverview from './AccCardOverview'

const { Title } = Typography

const AccCard = ({ acc }: AccPropTypes) => {
  return (
    <Card
      actions={[
        <AccDeleteButton acc={acc} key={`delete-${acc.id}`} />,
        <AccUpdateModal acc={acc} key={`update-${acc.id}`} />,
      ]}
    >
      <Title level={3}>{acc.name}</Title>
      {acc.is_testnet ? <Tag>Test</Tag> : <Tag>Live</Tag>}
      {acc.pendingFirstQuery ? (
        <Tag color="blue">Pending First Query</Tag>
      ) : null}
      {acc.detected_invalid ? <Tag color="red">Invalid Credentials</Tag> : null}
      <AccCardStatistics acc={acc} />
      <AccCardOverview acc={acc} />
      <CardChart acc={acc} />
    </Card>
  )
}

export default AccCard
