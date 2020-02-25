import React, { useContext } from 'react'
import MainDashboardTop from './MainDashboardTop'
import MainDashboardBottom from './MainDashboardBottom'
import { BitmexAcc } from '../types'
import { CalculationsContext } from '../context/CalculationsContext'
import { DashboardContext } from '../context/DashboardContext'

const MainDashboard: React.FunctionComponent = () => {
  const { testnet } = useContext(DashboardContext)
  const { accs } = useContext(CalculationsContext)

  const filtered: BitmexAcc[] = accs.filter(acc => acc.is_testnet == testnet)

  return (
    <>
        <MainDashboardTop accs={filtered} />
        <MainDashboardBottom accs={filtered} />
    </>
  )
}

export default MainDashboard
