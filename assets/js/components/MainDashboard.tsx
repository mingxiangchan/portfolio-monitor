import React, {useState, useEffect} from 'react'
import {Layout} from 'antd';
import Top from './MainDashboardTop'
import Bottom from './MainDashboardBottom'
import {BitmexAcc, BitmexAccsState} from '../types';
import socket, {afterJoinedAccChannel} from '../socket';

const {Content} = Layout;

export default () => {
  const [accounts, setAccs] = useState<BitmexAccsState>({})

  useEffect(() => {
    // @ts-ignore
    afterJoinedAccChannel(accChannel => {
      accChannel.push("get_accs").receive("ok", ({accs}: {accs: BitmexAccsState}) => {
        setAccs(accs)
        
        accChannel!.on("acc_update", ({acc}: {acc: BitmexAcc}) => {
          const updatedAcc = {...accounts[acc.id], ...acc}
          setAccs({...accounts, [acc.id]: updatedAcc})
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
            const updatedAcc = {...oldAcc, currentQty, liquidationPrice, lastPrice: lastPrice ? lastPrice : accsCopy[id].lastPrice}
            return {...prevAccs, [id]: updatedAcc}
          })
        })
      })

    })

    //userChannel.on("wsUpdate", resp => {
    //const bitMexAccId = resp.accId
    //if (resp.table === "position") {
    //// extract fields as needed
    //// update the acc object
    //}
    //})
  }, [])

  return (
    <Layout style={{marginLeft: 200, backgroundColor: '#000d19'}}>
      <Content style={{margin: '24px 16px 0', overflow: 'scroll', backgroundColor: "#001529", padding: 24}}>
        <Top accs={accounts}/>
        <Bottom accs={accounts}/>
      </Content>
    </Layout>
  )
}
