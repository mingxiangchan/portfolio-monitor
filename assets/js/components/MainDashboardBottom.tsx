import React from 'react'
import AccCard from './AccCard'
import { List, Row, Col, Card } from 'antd'
import { BitmexAcc } from '../types'

interface PropTypes {
  accs: BitmexAcc[]
}

const MainDashboardBottom: React.FunctionComponent<PropTypes> = ({
  accs,
}: PropTypes) => {
  return (
    <Row>
      <Card style={{ minHeight: '50vh' }}>
        <Col span={24}>
          <List
            grid={{ gutter: 16, column: 3 }}
            itemLayout="horizontal"
            pagination={{ pageSize: 3 }}
            dataSource={accs}
            renderItem={(acc): React.ReactNode => (
              <List.Item>
                <AccCard acc={acc} />
              </List.Item>
            )}
          />
        </Col>
      </Card>
    </Row>
  )
}

export default MainDashboardBottom
