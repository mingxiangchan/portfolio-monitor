import React, { useState, useEffect, useContext } from 'react'
import { Layout, Typography, Button, Switch, Divider, Spin } from 'antd'
import moment from 'moment'
import AccCreateModal from './AccCreateModal'
import DashboardContext from '../context/DashboardContext'
import BitmexContext from '../context/BitmexContext'
import axios from 'axios'

const { Title } = Typography
const { Sider } = Layout

const SideNav: React.FunctionComponent = () => {
  const [time, changeTime] = useState(moment())
  const [email, changeEmail] = useState(null)
  const { testPrice, realPrice, openTestPrice, openRealPrice } = useContext(
    BitmexContext,
  )
  const { testnet, setTestnet } = useContext(DashboardContext)

  const testPriceDiffAbs = testPrice - openTestPrice
  const testPriceDiffPer = ((testPriceDiffAbs / openTestPrice) * 100).toFixed(2)

  const realPriceDiffAbs = realPrice - openRealPrice
  const realPriceDiffPer = ((realPriceDiffAbs / openRealPrice) * 100).toFixed(2)

  if (!email) {
    axios.get('/api/current_user', { withCredentials: true }).then(resp => {
      changeEmail(resp.data.data.email)
    })
  }

  useEffect(() => {
    const int = setInterval(() => {
      changeTime(moment())
    }, 1000)

    return (): void => {
      clearInterval(int)
    }
  }, [])

  return (
    <Sider
      width={200}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        textAlign: 'center',
        padding: '20px',
      }}
    >
      <Title level={2} style={{ color: 'white' }}>
        {email ? email : <Spin />}
      </Title>
      <Title level={3} style={{ color: 'white' }}>
        {time.format('h:mm:ss A')}
      </Title>
      <Title level={3} style={{ color: 'white', marginBottom: '20px' }}>
        {time.format('MMM DD, YYYY')}
      </Title>
      {testnet ? (
        <>
          <Title level={4} style={{ color: 'red' }}>
            {'TESTNET'}
          </Title>
          <p style={{ color: 'white' }}>
            {testPriceDiffAbs} ({testPriceDiffPer}%)
          </p>
          <Title level={3} style={{ color: 'white', marginBottom: '20px' }}>
            {testPrice.toFixed(1)}
          </Title>
        </>
      ) : (
        <>
          <Title level={4} style={{ color: 'green' }}>
            {'LIVE'}
          </Title>
          <p style={{ color: 'white' }}>
            {realPriceDiffAbs} ({realPriceDiffPer}%)
          </p>
          <Title level={3} style={{ color: 'white' }}>
            {realPrice.toFixed(1)}
          </Title>
        </>
      )}
      <Switch
        defaultChecked={!testnet}
        unCheckedChildren="Test"
        checkedChildren="Live"
        onChange={(actual): void => {
          setTestnet(!actual)
        }}
      />
      <Divider />
      <AccCreateModal />
      <br />
      <Button type="danger">Log Out</Button>
    </Sider>
  )
}

export default SideNav
