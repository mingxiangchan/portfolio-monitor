import React from 'react'
import {Layout, Menu, Row, Col} from 'antd';
import AccCreateForm from './AccCreateForm'

const {Header, Footer, Sider, Content} = Layout;

const App = () => (
  <Row>
    <Col span={24}>
      <Layout>
        <Header>
          <Menu
            theme="dark"
            mode="horizontal"
          >
            <Menu.Item key="1">Home</Menu.Item>
          </Menu>
        </Header>
        <Layout>
          <Sider
            width={200}
            style={{
              overflow: 'auto',
              height: '100vh',
              position: 'fixed',
              left: 0,
            }}
          >
            <Menu
              mode="inline"
              style={{height: '100%', borderRight: 0}}
            >
              <Menu.Item key="1">option1</Menu.Item>
              <Menu.Item key="2">option2</Menu.Item>
              <Menu.Item key="3">option3</Menu.Item>
              <Menu.Item key="4">option4</Menu.Item>
            </Menu>
          </Sider>
          <Layout style={{marginLeft: 200}}>
            <Content style={{margin: '24px 16px 0', overflow: 'initial'}}>
              <div style={{padding: 24, background: '#fff', textAlign: 'center', minHeight: '85vh'}}>
                <AccCreateForm />
              </div>
            </Content>
          </Layout>
        </Layout>
        <Footer>Footer</Footer>
      </Layout>
    </Col>
  </Row>
)

export default App
