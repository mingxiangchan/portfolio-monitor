import React, { useContext } from 'react'
import { Layout } from 'antd'
import MainDashboardTop from './MainDashboardTop'
import MainDashboardBottom from './MainDashboardBottom'
import { BitmexAcc } from '../types'
import { CalculationsContext } from '../context/CalculationsContext'
import { DashboardContext } from '../context/DashboardContext'

const { Content } = Layout

const MainDashboard: React.FunctionComponent = () => {
  const { testnet } = useContext(DashboardContext)
  const { accs } = useContext(CalculationsContext)

  const filtered: BitmexAcc[] = accs.filter(acc => acc.is_testnet == testnet)

  return (
    <Layout style={{ marginLeft: 200, backgroundColor: '#000d19' }}>
      <Content style={{ padding: 24 }}>
        <MainDashboardTop accs={filtered} />
        <MainDashboardBottom accs={filtered} />
      </Content>
    </Layout>
  )
}

export default MainDashboard
