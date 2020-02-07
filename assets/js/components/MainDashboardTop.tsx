import React from 'react'
import Chart from './Chart'
import {Card, Descriptions, Row, Col, Spin} from 'antd'
import {BitmexAcc, BitmexAccsState} from '../types';

const opt = {
  scales: {
    yAxes: [
      {
        id: 'btcPrice',
        type: 'linear',
        position: 'left',
        ticks: {
          display: false
        }
      },
      {
        id: 'btcBalance',
        type: 'linear',
        position: 'left',
        ticks: {
          display: false
        }
      },
      {
        id: 'usdBalance',
        type: 'linear',
        position: 'left',
        ticks: {
          display: false
        }
      }
    ],
    xAxes: [
      {
        ticks: {
          display: false
        }
      }
    ]
  },
  tooltips: {
    mode: 'index',
    intersect: false
  },
  legend: {
    labels: {
      fontColor: "#999999"
    }
  }
}

export default ({accs}: {accs: BitmexAccsState}) => {
  if (accs == undefined) {
    return (
      <div style={{textAlign: 'center'}}>
        <Spin size="large" />
      </div>
    )
  }

  let total = {}

  const accsArray = Object.values(accs)

  for (let i = 0; i < accsArray.length; i++) {
    const acc = accsArray[i]
    if (!acc.historical_data) {
      continue
    }
    acc.historical_data.sort((a, b) => {
      if (a.inserted_at > b.inserted_at) {
        return 1
      } else {
        return -1
      }
    })
    for (let y = 0; y < acc.historical_data.length; y++) {
      const history = acc.historical_data[y]
      const date = history.inserted_at
      const btcPrice = history.btc_price
      const btcBalance = history.wallet_balance_btc / (10 ** 8)
      if (total[date]) {
        total[date].btcBalance += btcBalance
      } else {
        total[date] = {
          btcPrice,
          btcBalance
        }
      }
    }
  }

  const cummulative = Object.values(accs).reduce((total, acc) => {
    const {wallet_balance_now, deposit_btc, currentQty, marginBalance, unrealisedPnl, lastPrice, liquidationPrice} = acc
    const liqPriceGap = liquidationPrice && lastPrice ? liquidationPrice - lastPrice : total.liqPriceGap
    const smallerLiqPrice = liqPriceGap < total.liqPriceGap
    return {
      mBalance: marginBalance ? total.mBalance + marginBalance : total.mBalance,
      pnl: unrealisedPnl ? total.pnl + unrealisedPnl : total.pnl,
      qty: currentQty ? total.qty + currentQty : total.qty,
      balance: total.balance + acc.wallet_balance_now,
      start: total.start + deposit_btc,
      price: lastPrice ? lastPrice : total.price,
      liqPrice: smallerLiqPrice ? liquidationPrice : total.liqPrice,
      liqPriceGap: smallerLiqPrice ? liqPriceGap : total.liqPriceGap
    }
  }, {pnl: 0, qty: 0, balance: 0, start: 0, mBalance: 0, price: 0, liqPrice: 0, liqPriceGap: Infinity})

  const data = {
    labels: Object.keys(total).map((time) => (new Date(time).toLocaleString())).concat(["Now"]),
    datasets: [
      {
        label: 'BTC Price',
        data: Object.values(total).map(item => (item.btcPrice)).concat([cummulative.price]),
        fill: false,
        yAxisID: "btcPrice",
        borderColor: 'gold',
        pointBackgroundColor: 'gold'
      },
      {
        label: 'BTC Balance',
        data: Object.values(total).map(item => (item.btcBalance.toFixed(4))).concat([(cummulative.balance / (10 ** 8)).toFixed(4)]),
        fill: false,
        yAxisID: "btcBalance",
        borderColor: 'blue',
        pointBackgroundColor: 'blue'
      },
      {
        label: 'USD Balance',
        data: Object.values(total).map(item => ((item.btcPrice * item.btcBalance).toFixed(2))).concat([((cummulative.balance * cummulative.price) / (10 ** 8)).toFixed(2)]),
        fill: false,
        yAxisID: "usdBalance",
        borderColor: 'deeppink',
        pointBackgroundColor: 'deeppink'
      }
    ]
  }

  const rsi = cummulative.balance - cummulative.start
  const btcRsi = rsi / (10 ** 8)
  const leverage = Math.abs((cummulative.qty / cummulative.mBalance) * (10 ** 4))
  return (
    <Row type="flex" style={{width: "100%", borderBottom: "1px solid #383838", paddingBottom: '5px', marginBottom: '5px'}}>
      <Col span={11}>
        <Chart data={data} options={opt} />
      </Col>
      <Col span={13}>
        <Card title="Cummulative" style={{flexGrow: 1, marginLeft: '10px', backgroundColor: '#e6e6e6'}}>
          <Descriptions column={{md: 1, lg: 2}}>
            <Descriptions.Item label="Return since inception">{
              (rsi / cummulative.start).toFixed(2)}% / 
              BTC {btcRsi.toFixed(8)} / 
              USD {cummulative.price ? (btcRsi * cummulative.price).toFixed(2) : <Spin />}
            </Descriptions.Item>
            <Descriptions.Item label="Earned this month">TEST</Descriptions.Item>
            <Descriptions.Item label="Earned past 7-days">TEST</Descriptions.Item>
            <Descriptions.Item label="Earned past 24-hours">TEST</Descriptions.Item>
            <Descriptions.Item label="Paper gains">{cummulative.pnl ? (cummulative.pnl / (10 ** 8)).toFixed(8) : <Spin />}</Descriptions.Item>
            <Descriptions.Item label="Current leverage">{leverage && leverage != Infinity ? leverage.toFixed(1) : <Spin />}</Descriptions.Item>
            <Descriptions.Item label="Open position">{cummulative.qty ? cummulative.qty : <Spin />}</Descriptions.Item>
            <Descriptions.Item label="Liquidation price">{cummulative.liqPrice}</Descriptions.Item>
            <Descriptions.Item label="Ave. entry price">TEST</Descriptions.Item>
            <Descriptions.Item label="Balance">{(cummulative.balance / (10 ** 8)).toFixed(4)}</Descriptions.Item>
          </Descriptions>
        </Card>
      </Col>
    </Row>
  )
}
