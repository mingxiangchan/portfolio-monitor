import React, { useState } from 'react'
import { Layout, Row, Col } from 'antd'
import SideNav from './SideNav'
import MainDashboard from './MainDashboard'
import { AccountsContextProvider } from '../context/AccountsContext'
import DashboardContext from '../context/DashboardContext'
import { BitmexContextProvider } from '../context/BitmexContext'

const App: React.FunctionComponent = () => {
  const [testnet, setTestnet] = useState(false)

  return (
    <BitmexContextProvider>
      <AccountsContextProvider>
        <DashboardContext.Provider value={{ testnet, setTestnet }}>
          <Row>
            <Col span={24}>
              <Layout style={{ height: '100vh' }}>
                <Layout style={{ backgroundColor: 'black' }}>
                  <SideNav />
                  <MainDashboard />
                </Layout>
              </Layout>
            </Col>
          </Row>
        </DashboardContext.Provider>
      </AccountsContextProvider>
    </BitmexContextProvider>
  )
}

export default App
