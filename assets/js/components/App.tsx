import React, { useState } from 'react'
import { Layout } from 'antd'
import styled from 'styled-components'

import SideNav from './SideNav'
import TopNav from './TopNav'
import MainDashboard from './MainDashboard'
import { ContextProviders } from '../context/ContextProviders'
import { COLORS } from '../constants/styles'

const { Header, Content, Sider } = Layout

const SIDER_WIDTH = 200

const StyledMainLayout = styled(Layout)`
  height: 100vh;

  .ant-layout-sider {
    overflow: auto;
    height: 100vh;
    position: fixed;
    left: 0;
    text-align: center;
    padding: 10px 15px;
    background: ${COLORS.siderBg};
  }

  .ant-layout-header {
    position: absolute;
    right: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    padding: 0;
    background: white;
    box-shadow: 0px -10px 7px 9px #cecece;
  }

  .ant-layout-content {
    padding: 12px;
    margin-top: 64px;
  }
`

const App: React.FunctionComponent = () => {
  const [showSider, setShowSider] = useState(true)

  const toggleSider = (): void => setShowSider(!showSider)
  return (
    <ContextProviders>
      <StyledMainLayout>
        <Sider width={showSider ? SIDER_WIDTH : 0}>
          <SideNav />
        </Sider>
        <Layout
          style={{
            marginLeft: showSider ? SIDER_WIDTH : 0,
            position: 'relative',
          }}
        >
          <Header>
            <TopNav showSider={showSider} toggleSider={toggleSider} />
          </Header>
          <Content>
            <MainDashboard />
          </Content>
        </Layout>
      </StyledMainLayout>
    </ContextProviders>
  )
}

export default App
