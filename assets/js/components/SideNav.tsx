import React, {useState, useEffect} from 'react'
import {Layout, Menu, Typography, Button} from 'antd'
import moment from 'moment'

const { Title } = Typography;
const {Sider} = Layout

const SideNav = () => {
  const [time, changeTime] = useState(moment())

  useEffect(() => {
    const int = setInterval(() => {
      changeTime(moment())
    }, 1000)
    return () => {
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
        padding: '20px'
      }}
    >
      <Title level={2} style={{color: 'white'}}>Hi Josh</Title>
      <Title level={3} style={{color: 'white'}}>{time.format("h:mm:ss A")}</Title>
      <Title level={3} style={{color: 'white', marginBottom: '20px'}}>{time.format("MMM DD, YYYY")}</Title>
      <p style={{color: 'white'}}>65.1 (0.67%)</p>
      <Title level={3} style={{color: 'white'}}>9444.5</Title>
      <Button type="danger">Log Out</Button>
    </Sider>
  )
}

export default SideNav
