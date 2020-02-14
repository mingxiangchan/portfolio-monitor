import React, {useContext} from 'react'
import Chart from './Chart'
import { Card, Descriptions, Row, Col, Spin } from 'antd'
import { BitmexAcc } from '../types';
import { formatEarnings } from '../utils/priceFormat'
import BitmexContext from '../context/BitmexContext';
import DashboardContext from '../context/DashboardContext';

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

export default ({ accs }: { accs: BitmexAcc[] }) => {
  let total = {}

  const {testPrice, realPrice} = useContext(BitmexContext)
  const {testnet} = useContext(DashboardContext)

  for (let i = 0; i < accs.length; i++) {
    const acc = accs[i]
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

  const price = testnet ? testPrice : realPrice

  const cummulative = accs.reduce((total, acc) => {
    const { wallet_balance_30_days, wallet_balance_7_days, wallet_balance_1_day, wallet_balance_now, deposit_btc, currentQty, marginBalance, unrealisedPnl, lastPrice, liquidationPrice, avgEntryPrice, avg_entry_price, name } = acc
    const liqPriceGap = (liquidationPrice && lastPrice) ? Math.abs(liquidationPrice - lastPrice) : total.liqPriceGap
    const smallerLiqPrice = liqPriceGap < total.liqPriceGap
    const entryPrice = (avgEntryPrice ? parseFloat(avgEntryPrice) : avg_entry_price ? parseFloat(avg_entry_price) : 0)
    return {
      mBalance: total.mBalance + (marginBalance ? marginBalance : acc.margin_balance),
      pnl: unrealisedPnl ? total.pnl + unrealisedPnl : total.pnl,
      qty: currentQty ? total.qty + currentQty : total.qty,
      balance: total.balance + acc.wallet_balance_now,
      start: total.start + deposit_btc,
      price: lastPrice ? lastPrice : total.price,
      liqPrice: smallerLiqPrice ? liquidationPrice : total.liqPrice,
      liqPriceGap: smallerLiqPrice ? liqPriceGap : total.liqPriceGap,
      priceDay: total.priceDay + wallet_balance_1_day,
      price7: total.price7 + wallet_balance_7_days,
      price30: total.price30 + wallet_balance_30_days,
      entry: total.entry + entryPrice,
      liqAcc: smallerLiqPrice ? name : total.liqAcc,
      entryCount: total.entryCount + (entryPrice ? 1 : 0)
    }
  }, { entryCount: 0, pnl: 0, qty: 0, balance: 0, start: 0, mBalance: 0, price, liqPrice: 0, liqPriceGap: Infinity, liqAcc: "", price30: 0, price7: 0, priceDay: 0, entry: 0 })

  const graphData = { price: [], btcBalance: [], usdBalance: [] }
  const totalValues = Object.values(total)

  for (let i = 0; i < totalValues.length; i++) {
    const value = totalValues[i]
    graphData.price.push(value.btcPrice)
    graphData.btcBalance.push(value.btcBalance.toFixed(4))
    graphData.usdBalance.push((value.btcPrice * value.btcBalance).toFixed(2))
  }

  const data = {
    labels: Object.keys(total).map((time) => (new Date(time).toLocaleString())).concat(["Now"]),
    datasets: [
      {
        label: 'BTC Price',
        data: graphData.price.concat([cummulative.price]),
        fill: false,
        yAxisID: "btcPrice",
        borderColor: 'gold',
        pointBackgroundColor: 'gold'
      },
      {
        label: 'BTC Balance',
        data: graphData.btcBalance.concat([(cummulative.balance / (10 ** 8)).toFixed(4)]),
        fill: false,
        yAxisID: "btcBalance",
        borderColor: 'blue',
        pointBackgroundColor: 'blue'
      },
      {
        label: 'USD Balance',
        data: graphData.usdBalance.concat([((cummulative.balance * cummulative.price) / (10 ** 8)).toFixed(2)]),
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
    <Row type="flex" style={{ width: "100%", borderBottom: "1px solid #383838", paddingBottom: '5px', marginBottom: '5px', maxHeight: "45vh" }}>
      <Card>
        <Col span={11}>
          <Chart data={data} options={opt} />
        </Col>
        <Col span={12} offset={1}>
          <Descriptions column={{ md: 1, lg: 2 }} size="small" title="Cumulative">
            <Descriptions.Item label="Return since inception">{formatEarnings(cummulative.start, cummulative.balance, cummulative.price)}</Descriptions.Item>
            <Descriptions.Item label="Earned this month">{formatEarnings(cummulative.price30, cummulative.balance, cummulative.price)}</Descriptions.Item>
            <Descriptions.Item label="Earned past 7-days">{formatEarnings(cummulative.price7, cummulative.balance, cummulative.price)}</Descriptions.Item>
            <Descriptions.Item label="Earned past 24-hours">{formatEarnings(cummulative.priceDay, cummulative.balance, cummulative.price)}</Descriptions.Item>
            <Descriptions.Item label="Paper gains">{cummulative.pnl ? (cummulative.pnl / (10 ** 8)).toFixed(8) : <Spin />}</Descriptions.Item>
            <Descriptions.Item label="Current leverage">{leverage && leverage != Infinity ? leverage.toFixed(2) : <Spin />}</Descriptions.Item>
            <Descriptions.Item label="Open position">{cummulative.qty ? cummulative.qty : <Spin />}</Descriptions.Item>
            <Descriptions.Item label="Nearest liquidation price">{cummulative.liqPrice + ` (${cummulative.liqAcc})`}</Descriptions.Item>
            <Descriptions.Item label="Ave. entry price">{cummulative.entry / cummulative.entryCount}</Descriptions.Item>
            <Descriptions.Item label="Balance(BTC)">{(cummulative.mBalance / (10 ** 8)).toFixed(4)}</Descriptions.Item>
            <Descriptions.Item label="Balance(USD)">{(cummulative.mBalance / (10 ** 8) * cummulative.price).toFixed(2)}</Descriptions.Item>
          </Descriptions>
        </Col>
      </Card>
    </Row>
  )
}
