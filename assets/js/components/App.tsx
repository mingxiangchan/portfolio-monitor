import React from 'react'
import { Layout, Row, Col } from 'antd'
import SideNav from './SideNav'
import MainDashboard from './MainDashboard'
import { ContextProviders } from '../context/ContextProviders'

const App: React.FunctionComponent = () => {
  return (
    <ContextProviders>
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
    </ContextProviders>
  )
}

export default App
