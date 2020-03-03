import React from 'react'
import styled from 'styled-components'
import { Row, Col, Card, Badge, Empty, Skeleton, Tag } from 'antd'

import { BitmexAcc } from '../types'
import ListSort from './ListSort'
import AccCardStatistics from './AccCardStatistics'
import AccCardOverview from './AccCardOverview'
import AccCardHeader from './AccCardHeader'
import AccDeleteForm from './AccDeleteButton'
import AccUpdateModal from './AccUpdateModal'
import CardChart from './CardChart'
import { COLORS } from '../constants/styles'

interface PropTypes {
  accs: BitmexAcc[]
  loadingAcc: boolean
}

interface CardOrder {
  key: number
}

const ListSortContainer = styled.div`
  position: relative;
  overflow: hidden;

  .mid-col {
    .ant-card,
    .ant-card-body {
      height: 100%;
    }
  }

  .card {
    margin-bottom: 15px;
    min-height: 200px;
    background: ${COLORS.lightBg};
    border-radius: 4px;
  }

  .stat-items {
    .ant-statistic .ant-statistic-content {
      font-size: 24px;
    }
    .stat-subtitle {
      font-size: 15px;
    }
  }

  .tags {
    margin-bottom: 1em;
    .ant-tag {
      margin-bottom: 5px;
    }
  }

  .action-btns {
    position: absolute;
    right: 26px;
    bottom: 18px;
    z-index: 999;

    .anticon {
      font-size: 1.3em;
      margin-left: 0.7em;
    }
  }
`

const MainDashboardBottom = ({ accs, loadingAcc }: PropTypes) => {
  const numAccs = accs.length
  const TitleNode = () => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      Bitmex Accounts
      <Badge
        count={numAccs}
        style={{
          marginLeft: '5px',
          backgroundColor: '#fff',
          color: '#999',
          boxShadow: '0 0 0 1px #d9d9d9 inset',
        }}
      />
    </div>
  )

  const setCardOrder = (cards: CardOrder[]) => {
    localStorage.setItem(
      'bitmexAccOrder',
      cards.map(card => card.key).join(','),
    )
  }

  return (
    <Card type="inner" title={<TitleNode />}>
      <Skeleton paragraph={{ rows: 4 }} loading={loadingAcc} />
      {!loadingAcc && accs.length === 0 ? (
        <Empty style={{ margin: '3em 0' }} />
      ) : (
        <ListSortContainer>
          <ListSort
            onChange={setCardOrder}
            dragClassName="list-drag-selected"
            appearAnim={{ animConfig: { marginTop: [5, 30], opacity: [1, 0] } }}
          >
            {accs.map(acc => (
              <Card hoverable key={acc.id} className="card">
                <div className="action-btns">
                  <AccUpdateModal acc={acc} />
                  <AccDeleteForm acc={acc} />
                </div>

                <Row style={{ display: 'flex' }} gutter={[16, 16]}>
                  <Col lg={8}>
                    <AccCardHeader acc={acc} />
                    <AccCardStatistics acc={acc} />
                  </Col>
                  <Col className="mid-col" lg={10}>
                    <AccCardOverview acc={acc} />
                  </Col>

                  <Col lg={6}>
                    <div className="tags">
                      {acc.is_testnet ? <Tag>Test</Tag> : <Tag>Live</Tag>}
                      {acc.pendingFirstQuery ? (
                        <Tag color="blue">Pending First Query</Tag>
                      ) : null}
                      {acc.detected_invalid ? (
                        <Tag color="red">Invalid Credentials</Tag>
                      ) : null}
                    </div>
                    <CardChart acc={acc} />
                  </Col>
                </Row>
              </Card>
            ))}
          </ListSort>
        </ListSortContainer>
      )}
    </Card>
  )
}

export default MainDashboardBottom
