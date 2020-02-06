import React, {useState, useEffect} from 'react'
import {Layout} from 'antd';
import Top from './MainDashboardTop'
import Bottom from './MainDashboardBottom'
import {BitmexAcc, BitmexAccsState} from '../types';
import socket, {afterJoinedAccChannel} from '../socket';

const {Content} = Layout;

export default () => {
  const [accs, setAccs] = useState<BitmexAccsState>({})

  useEffect(() => {
    // @ts-ignore
    afterJoinedAccChannel(accChannel => {
      accChannel.push("get_accs").receive("ok", ({accs}: {accs: BitmexAccsState}) => {
        setAccs(accs)
      })

      accChannel!.on("acc_update", ({acc}: {acc: BitmexAcc}) => {
        const updatedAcc = {...accs[acc.id], ...acc}
        setAccs({...accs, [acc.id]: updatedAcc})
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

  console.log(accs)

  return (
    <Layout style={{marginLeft: 200, backgroundColor: '#000d19'}}>
      <Content style={{margin: '24px 16px 0', overflow: 'scroll', backgroundColor: "#001529", padding: 24}}>
        <Top />
        <Bottom />
      </Content>
    </Layout>
  )
}
