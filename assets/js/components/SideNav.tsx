import React, {useState, useEffect} from 'react'
import {Layout, Menu, Typography, Button, Spin} from 'antd'
import moment from 'moment'
import {generalChannel} from "../socket"
import AccCreateModal from './AccCreateModal'

const url = "https://testnet.bitmex.com/api/v1/trade/bucketed?binSize=1d&partial=false&symbol=XBTUSD&count=1&reverse=true"

const {Title} = Typography;
const {Sider} = Layout

const SideNav = () => {
  const [time, changeTime] = useState(moment())
  const [testPrice, changePrice] = useState(0)
  const [realPrice, changeRealPrice] = useState(0)
  const [loaded, changeLoaded] = useState(false)
  const [openTestPrice, changeOpenTestPrice] = useState(1)
  const [openRealPrice, changeOpenRealPrice] = useState(1)

  const testPriceDiffAbs = testPrice - openTestPrice
  const testPriceDiffPer = (testPriceDiffAbs / openTestPrice).toFixed(2)

  const realPriceDiffAbs = realPrice - openRealPrice
  const realPriceDiffPer = (realPriceDiffAbs / openRealPrice).toFixed(2)

  useEffect(() => {
    generalChannel.push("get_opening_price").receive("ok", resp => {
      changeOpenTestPrice(resp.opening_test_price)
      changeOpenRealPrice(resp.opening_real_price)
    })

    generalChannel.on("testnet_price", resp => {
      loaded ? null : changeLoaded(true)
      const newPrice: number = resp.data.data[0].price
      changePrice(newPrice)
    })

    generalChannel.on("livenet_price", resp => {
      loaded ? null : changeLoaded(true)
      const newPrice: number = resp.data.data[0].price
      changeRealPrice(newPrice)
    })

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
      <Title level={4} style={{color: 'red'}}>{"TESTNET"}</Title>
      <p style={{color: 'white'}}>{testPriceDiffAbs} ({testPriceDiffPer}%)</p>
      <Title level={3} style={{color: 'white', marginBottom: '20px'}}>{loaded ? testPrice.toFixed(1) : <Spin />}</Title>
      <Title level={4} style={{color: 'green'}}>{"LIVE"}</Title>
      <p style={{color: 'white'}}>{realPriceDiffAbs} ({realPriceDiffPer}%)</p>
      <Title level={3} style={{color: 'white'}}>{loaded ? realPrice.toFixed(1) : <Spin />}</Title>
      <AccCreateModal />
      <br />
      <Button type="danger">Log Out</Button>
    </Sider>
  )
}

export default SideNav
