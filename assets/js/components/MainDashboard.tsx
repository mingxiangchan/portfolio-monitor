import React, { useContext } from 'react'
import MainDashboardTop from './MainDashboardTop'
import MainDashboardBottom from './MainDashboardBottom'
import { BitmexAcc } from '../types'
import { CalculationsContext } from '../context/CalculationsContext'
import { DashboardContext } from '../context/DashboardContext'
import AccountsContext from '../context/AccountsContext'

const getSortedAccs = (bitmexAccs: BitmexAcc[]) => {
  // default sort: simply sort by account ID
  const defaultSort = bitmexAccs.sort(acc => acc.id)

  // accOrder from localStorage looks like this: ie. "4,3,2,1,5"
  const accOrder = localStorage.getItem('bitmexAccOrder')

  // Use default sort if localstorage does not contain 'bitmexAccOrder'
  if (!accOrder) return defaultSort

  // turn accOrder into array of integers: ie. [4,3,2,1,5]
  const accOrderArr = accOrder.split(',').map(id => parseInt(id))

  // accOrder array must be equal size to number of bitmex accounts
  const matchLength = bitmexAccs.length === accOrderArr.length

  // IDs in accOrder must match those in bitmexAccs
  const matchId = bitmexAccs.every(acc => accOrderArr.includes(acc.id))

  if (matchLength && matchId) {
    return accOrderArr.map(id => bitmexAccs.find(acc => acc.id === id))
  } else {
    return defaultSort
  }
}

const MainDashboard: React.FunctionComponent = () => {
  const { testnet } = useContext(DashboardContext)
  const { accs } = useContext(CalculationsContext)
  const { loadingAcc } = useContext(AccountsContext)

  const filtered: BitmexAcc[] = accs.filter(acc => acc.is_testnet == testnet)

  const sorted: BitmexAcc[] = getSortedAccs(filtered)

  return (
    <>
      <MainDashboardTop accs={filtered} />
      <MainDashboardBottom accs={sorted} loadingAcc={loadingAcc} />
    </>
  )
}

export default MainDashboard
