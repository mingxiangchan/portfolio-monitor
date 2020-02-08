import React from 'react'
import Cards from './Cards'
import {List, Row, Col, Card, Spin} from 'antd'
import {BitmexAcc} from '../types';

export default ({accs}: {accs: BitmexAcc[]}) => {
  const loading = accs.length === 0
  return (
    <Row >
      <Card style={{minHeight: "50vh"}} >
        <Col span={24} style={loading ? {display: "flex", justifyContent: "center", alignItems: "center", height: "45vh"} : {}}>
          {loading ? <Spin size="large" tip="Loading Accounts" /> :
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
          }
        </Col>
      </Card>
    </Row>
  )
}
