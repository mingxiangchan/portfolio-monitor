import React, { useState, useEffect, useContext } from 'react'
import { Typography, Switch, Divider } from 'antd'
import styled from 'styled-components'
import moment from 'moment'
import AccCreateModal from './AccCreateModal'
import { DashboardContext } from '../context/DashboardContext'
import { BitmexContext } from '../context/BitmexContext'
import { centsToFiat } from '../utils/priceFormat'

const { Text, Title } = Typography

const StyledSider = styled.div`
  /* position: relative; */
  height: 100%;

  .ant-switch {
    background-color: #d27070;
  }

  .ant-switch-checked {
    background-color: #279a27;
  }

  .ant-typography {
    &.clock,
    &.date {
      color: #c1c1c1;
      margin-top: 20px;
      margin-bottom: 15px;
    }

    &.date {
      font-weight: 300;
    }

    &.clock {
      margin-top: 10px;
      margin-bottom: 20px;
      font-weight: 200;
    }
  }

  .ant-typography.date {
  }

  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;

    img {
      height: 50px;
    }

    .testnet,
    .live {
      font-size: 1.5rem;
      text-transform: uppercase;
      font-weight: 700;
    }

    .testnet {
      color: #ff9393;
    }

    .live {
      color: #87fb87;
    }
  }
`

const PriceDisplay = styled.section`
  color: ${props => (props.positive ? '#87fb87' : '#ff2929')};
  p {
    margin: 0;
  }
  .price {
    color: white;
    font-size: 2rem;
  }
`

const SideNav: React.FunctionComponent = () => {
  const [time, changeTime] = useState(moment())
  const prices = useContext(BitmexContext)
  const { testPrice, livePrice, openTestPrice, openLivePrice } =
    prices['XBTUSD'] || {}
  const { testnet, setTestnet } = useContext(DashboardContext)

  const testPriceDiffAbs = testPrice - openTestPrice
  const testPriceDiffPer = ((testPriceDiffAbs / openTestPrice) * 100).toFixed(2)

  const livePriceDiffAbs = livePrice - openLivePrice
  const livePriceDiffPer = ((livePriceDiffAbs / openLivePrice) * 100).toFixed(2)

  useEffect(() => {
    const int = setInterval(() => {
      changeTime(moment())
    }, 1000)

    return (): void => {
      clearInterval(int)
    }
  }, [])

  return (
    <StyledSider>
      <div className="header">
        <img src="/images/bitmex-logo.png" />
        {testnet ? (
          <div className="testnet">Testnet</div>
        ) : (
          <div className="live">LIVE</div>
        )}
      </div>
      <Switch
        defaultChecked={!testnet}
        unCheckedChildren="Test"
        checkedChildren="Live"
        onChange={(actual): void => {
          setTestnet(!actual)
        }}
      />
      <Title className="date" level={4}>
        {time.format('MMM DD, YYYY')}
      </Title>
      <Title className="clock" level={4}>
        {time.format('h:mm:ss A')}
      </Title>
      <Divider style={{ background: '#757575' }} />
      <PriceDisplay
        positive={testnet ? testPriceDiffAbs >= 0 : realPriceDiffAbs >= 0}
      >
        <p className="diff">
          {testnet
            ? `${centsToFiat(testPriceDiffAbs)} (${testPriceDiffPer}%)`
            : `${centsToFiat(realPriceDiffAbs)} (${realPriceDiffPer}%)`}
        </p>
        <p className="price">
          {testnet ? centsToFiat(testPrice).toFixed(1) : centsToFiat(realPrice).toFixed(1)}
        </p>
      </PriceDisplay>

      <AccCreateModal />
      <br />
    </StyledSider>
  )
}

export default SideNav
