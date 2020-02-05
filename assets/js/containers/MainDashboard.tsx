import React from 'react'
import {Layout} from 'antd';
import Top from './MainDashboardTop'
import Bottom from './MainDashboardBottom'

const {Content} = Layout;

export default () => {
  return (
    <Layout style={{marginLeft: 200, backgroundColor: '#000d19'}}>
      <Content style={{margin: '24px 16px 0', overflow: 'scroll', backgroundColor: "#001529", padding: 24}}>
        <Top />
        <Bottom />
      </Content>
    </Layout>
  )
}