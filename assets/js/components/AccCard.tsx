import React, { useContext } from 'react'
import { Card, Tag, Typography } from 'antd'
import { AccPropTypes } from '../types'
import CardChart from './CardChart'
import AccUpdateModal from './AccUpdateModal'
import BitmexContext from '../context/BitmexContext'
import DashboardContext from '../context/DashboardContext'
import AccDeleteButton from './AccDeleteButton'
import AccCardStatistics from './AccCardStatistics'
import AccCardOverview from './AccCardOverview'
import { satToBtc } from '../utils/priceFormat'

const { Title } = Typography

const AccCard: React.FunctionComponent<AccPropTypes> = ({
  acc,
}: AccPropTypes) => {
  const { testPrice, realPrice } = useContext(BitmexContext)
  const { testnet } = useContext(DashboardContext)

  const livePrice = testnet ? testPrice : realPrice
  const btcBalance = satToBtc(acc.marginBalance)
  const usdBalance = btcBalance * livePrice
  console.log(livePrice)

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
      <AccCardStatistics
        acc={acc}
        btcBalance={btcBalance}
        usdBalance={usdBalance}
      />
      <AccCardOverview
        acc={acc}
        btcBalance={btcBalance}
        usdBalance={usdBalance}
        livePrice={livePrice}
      />
      <CardChart acc={acc} />
    </Card>
  )
}

export default AccCard
