import React, { useContext } from 'react'
import { Layout } from 'antd'
import MainDashboardTop from './MainDashboardTop'
import MainDashboardBottom from './MainDashboardBottom'
import { BitmexAcc } from '../types'
import AccountsContext from '../context/AccountsContext'
import DashboardContext from '../context/DashboardContext'

const { Content } = Layout

const MainDashboard: React.FunctionComponent = () => {
  const { accounts } = useContext(AccountsContext)
  const { testnet } = useContext(DashboardContext)

  const expandedAccs: BitmexAcc[] = []
  for (const id in accounts) {
    if (accounts[id].is_testnet == testnet) {
      expandedAccs.push(accounts[id])
    }
  }

  return (
    <Layout style={{ marginLeft: 200, backgroundColor: '#000d19' }}>
      <Content style={{ padding: 24 }}>
        <MainDashboardTop accs={expandedAccs} />
        <MainDashboardBottom accs={expandedAccs} />
      </Content>
    </Layout>
  )
}

export default MainDashboard
