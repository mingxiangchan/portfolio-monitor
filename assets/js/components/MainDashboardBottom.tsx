import React from 'react'
import Cards from './Cards'
import {List} from 'antd'
import {BitmexAcc} from '../types';

export default ({accs}: {accs: BitmexAcc[]}) => {
  return (
    <div style={{width: "100%", minHeight: "40vh"}}>
      <List
        grid={{gutter: 16, column: 3}}
        itemLayout="horizontal"
        pagination={{pageSize: 3}}
        dataSource={accs}
        renderItem={acc => (
          <List.Item>
            <Cards acc={acc} />
          </List.Item>
        )}
      />
    </div>
  )
}
