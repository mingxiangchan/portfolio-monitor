import React, {useState, useEffect} from 'react'
import {Layout} from 'antd';
import MainDashboardTop from './MainDashboardTop'
import MainDashboardBottom from './MainDashboardBottom'
import {BitmexAcc, BitmexAccsState} from '../types';
import {afterJoinedAccChannel} from '../socket';

const {Content} = Layout;

export default () => {
  const [accounts, setAccs] = useState<BitmexAccsState>(null)

  useEffect(() => {
    // @ts-ignore
    afterJoinedAccChannel(accChannel => {
      accChannel.push("get_accs").receive("ok", ({accs}: {accs: BitmexAccsState}) => {
        setAccs(accs)

        accChannel!.on("acc_update", ({acc}: {acc: BitmexAcc}) => {
          const updatedAcc = {...accounts[acc.id], ...acc}
          setAccs((prevAccs) => {
            return {...prevAccs, [acc.id]: updatedAcc}
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

  const expandedAccs: BitmexAcc[] = []
  for (const id in accounts) {
    expandedAccs.push(accounts[id])
  }


  console.log(expandedAccs)

  return (
    <Layout style={{marginLeft: 200, backgroundColor: '#000d19'}}>
      <Content style={{padding: 24}}>
        <MainDashboardTop accs={expandedAccs} />
        <MainDashboardBottom accs={expandedAccs} />
      </Content>
    </Layout>
  )
}
