import React from 'react'
import {Layout} from 'antd';

const {Content} = Layout;

export default () => {
  return (
    <Layout style={{marginLeft: 200}}>
      <Content style={{margin: '24px 16px 0', overflow: 'initial'}}>
        <div style={{padding: 24, background: '#fff', textAlign: 'center', minHeight: '85vh'}}>
          Content
        </div>
      </Content>
    </Layout>
  )
}