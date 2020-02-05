import React, {useState, useEffect} from 'react'
import {Layout, Menu, Typography, Button, Spin} from 'antd'
import moment from 'moment'
import {generalChannel} from "../socket"

const url = "https://testnet.bitmex.com/api/v1/trade/bucketed?binSize=1d&partial=false&symbol=XBTUSD&count=1&reverse=true"

const {Title} = Typography;
const {Sider} = Layout

const SideNav = () => {
  const [time, changeTime] = useState(moment())
  const [price, changePrice] = useState(0)
  const [loaded, changeLoaded] = useState(false)
  const [openPrice, changeOpenPrice] = useState(1)

  generalChannel.on("openingPrice", resp => {
    console.log(resp)
  })

  // @ts-ignore
  generalChannel.on("price", resp => {
    loaded ? null : changeLoaded(true)
    const newPrice: number = resp.data.data[0].price
    changePrice(newPrice)
  })

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
      <Title level={3} style={{color: 'white'}}>{loaded ? price.toFixed(1) : <Spin />}</Title>
      <Button type="danger">Log Out</Button>
    </Sider>
  )
}

export default SideNav
