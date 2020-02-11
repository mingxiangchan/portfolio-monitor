import React, {useEffect, useState} from 'react'
import {Layout, Row, Col} from 'antd';
import TopNav from './TopNav'
import SideNav from './SideNav'
import MainDashboard from './MainDashboard'
import AccountsContext from '../context/AccountsContext'
import DashboardContext from '../context/DashboardContext'
import {afterJoinedAccChannel} from '../socket';
import {BitmexAcc, BitmexAccsState} from '../types';

const {Content} = Layout;

const App = () => {

  const [accounts, setAccs] = useState<BitmexAccsState>(null)
  const [testnet, setTestnet] = useState(false)

  useEffect(() => {
    // @ts-ignore
    afterJoinedAccChannel(accChannel => {
      accChannel.push("get_accs").receive("ok", ({accs}: {accs: BitmexAccsState}) => {
        setAccs(accs)

        accChannel!.on("acc_update", ({acc}: {acc: BitmexAcc}) => {
          setAccs((prevAccs) => {
            return {...prevAccs, [acc.id]: acc}
          })
        })

        accChannel!.on("ws_margin", resp => {
          const id = resp.acc_id
          const {unrealisedPnl, marginBalance} = resp.data[0]
          setAccs((prevAccs) => {
            const oldAcc = prevAccs[id]
            const updatedAcc = {...oldAcc, ...unrealisedPnl && {unrealisedPnl}, ...marginBalance && {marginBalance}}
            return {...prevAccs, [id]: updatedAcc}
          })
        })
        accChannel!.on("ws_position", resp => {
          const id = resp.acc_id
          // avgEntryPrice missing
          const {currentQty, liquidationPrice, lastPrice} = resp.data[0]
          setAccs((prevAccs) => {
            const oldAcc = prevAccs[id]
            const updatedAcc = {...oldAcc, currentQty, liquidationPrice, lastPrice: lastPrice ? lastPrice : oldAcc.lastPrice}
            return {...prevAccs, [id]: updatedAcc}
          })
        })
      })

    })
  }, [])

  return (
    <AccountsContext.Provider value={{accounts}}>
      <DashboardContext.Provider value={{testnet, setTestnet}}>
        <Row>
          <Col span={24}>
            <Layout style={{height: '100vh'}}>
              <Layout style={{backgroundColor: 'black'}}>
                <SideNav />
                <MainDashboard />
              </Layout>
            </Layout>
          </Col>
        </Row>
      </DashboardContext.Provider> 
    </AccountsContext.Provider>
  )
}

export default App
