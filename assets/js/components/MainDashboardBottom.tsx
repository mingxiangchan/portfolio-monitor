import React from 'react'
import styled from 'styled-components'
import { Row, Col, Card, Badge, Empty, Skeleton, Typography } from 'antd'

import { BitmexAcc } from '../types'
import ListSort from './ListSort'
import AccCardStatistics from './AccCardStatistics'
import AccCardOverview from './AccCardOverview'
import CardChart from './CardChart'
import AccDeleteForm from './AccDeleteButton'
import AccUpdateModal from './AccUpdateModal'

const { Text } = Typography
interface PropTypes {
  accs: BitmexAcc[]
  loadingAcc: boolean
}

interface CardOrder {
  key: number
}

const ListSortContainer = styled.div`
  cursor: url('http://gtms02.alicdn.com/tps/i2/T1_PMSFLBaXXcu5FDa-20-20.png') 10
      10,
    pointer !important;
  position: relative;
  overflow: hidden;

  .acc-heading {
    padding-top: 8px;
    padding-left: 10px;

    h2 {
      font-size: 1.4rem;
      margin-bottom: 0;
      font-weight: 300;
    }
  }

  span.na {
    color: #7d7d7d;
    font-weight: 300;
    font-size: 0.8em;
    letter-spacing: 2px;
  }

  .card {
    margin-bottom: 15px;
    min-height: 200px;
    background: #fafafa;
    border-radius: 4px;
  }

  .stat-items {
    .ant-statistic .ant-statistic-content {
      font-size: 24px;

      .ant-dropdown-link {
        margin-bottom: 30px;
      }
    }
    .stat-subtitle {
      font-size: 15px;
    }
  }

  .overview-items {
    .ant-statistic {
      margin-bottom: 12px;

      .ant-statistic-content {
        font-size: 18px;
      }
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
                <Row gutter={[16, 16]}>
                  <Col lg={8}>
                    <div className="acc-heading">
                      <h2>{acc.name}</h2>
                      <h4>
                        <Text type="secondary">{acc.notes}</Text>
                      </h4>
                      <br />
                    </div>
                    <AccCardStatistics acc={acc} />
                  </Col>
                  <Col lg={10}>
                    <AccCardOverview acc={acc} />
                  </Col>
                  <Col lg={6}>
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
