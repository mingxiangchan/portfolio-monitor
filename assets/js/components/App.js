import React from 'react'
import {Layout, Row, Col} from 'antd';
import AccCreateForm from './AccCreateForm'
import TopNav from './TopNav'
import SideNav from './SideNav'

const {Content} = Layout;

const App = () => (
  <Row>
    <Col span={24}>
      <Layout>
        <TopNav />
        <Layout style={{ marginTop: 64 }}>
          <SideNav />
          <Layout style={{marginLeft: 200}}>
            <Content style={{margin: '24px 16px 0', overflow: 'initial'}}>
              <div style={{padding: 24, background: '#fff', textAlign: 'center', minHeight: '85vh'}}>
                Content
              </div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </Col>
  </Row>
)

export default App
