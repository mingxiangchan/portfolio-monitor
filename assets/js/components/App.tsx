import React from 'react'
import {Layout, Row, Col} from 'antd';
import TopNav from './TopNav'
import SideNav from './SideNav'
import MainDashboard from './MainDashboard'

const {Content} = Layout;

const App = () => (
  <Row>
    <Col span={24}>
      <Layout style={{height: '100vh'}}>
        <TopNav />
        <Layout style={{marginTop: 50, backgroundColor: 'black'}}>
          <SideNav />
          <MainDashboard />
        </Layout>
      </Layout>
    </Col>
  </Row>
)

export default App
