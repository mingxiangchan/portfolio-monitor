import React from 'react'
import Cards from './Cards'
import {List} from 'antd'
import {BitmexAcc} from '../types';

export default ({accs}: {accs: BitmexAcc[]}) => {

  return (
    <div style={{width: "100%"}}>
      <List
        itemLayout="horizontal"
        size="large"
        pagination={{pageSize: 1}}
        dataSource={accs}
        renderItem={(acc, idx) => (
          <List.Item style={{width: "30%"}}>
            <Cards style={{backgroundColor: '#e6e6e6'}} acc={acc} />
          </List.Item>
        )}
      />
    </div>
  )
}
