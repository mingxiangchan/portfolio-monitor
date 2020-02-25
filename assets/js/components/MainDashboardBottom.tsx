import React from 'react'
import styled from 'styled-components'
import { List, Row, Col, Card, Badge, Icon } from 'antd'

import AccCard from './AccCard'
import { BitmexAcc } from '../types'

interface PropTypes {
  accs: BitmexAcc[]
}

const DashboardBtm = styled.div`
  .ant-list-item-extra {
    width: 60%;
  }
`


const MainDashboardBottom = ({ accs }: PropTypes) => {
  const TitleNode = () => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      Bitmex Accounts
      <Badge
        count={4}
        style={{
          marginLeft: '5px',
          backgroundColor: '#fff',
          color: '#999',
          boxShadow: '0 0 0 1px #d9d9d9 inset',
        }}
      />
    </div>
  )

  return (
    <DashboardBtm>
      <Card title={<TitleNode />}>
        <Col span={24}>
        <List
            itemLayout="vertical"
            size="large"
            pagination={{ pageSize: 10 }}
            dataSource={accs}
            renderItem={(acc): React.ReactNode => <AccCard acc={acc} />}
          />
        </Col>
      </Card>
    </DashboardBtm>
  )
}

export default MainDashboardBottom
