import React from 'react'
import { BitmexContextProvider } from './BitmexContext'
import { AccountsContextProvider } from './AccountsContext'
import { DashboardContextProvider } from './DashboardContext'
import { CalculationsContextProvider } from './CalculationsContext'

const ContextProviders = ({ children }: React.PropsWithChildren<{}>) => {
  return (
    <BitmexContextProvider>
      <AccountsContextProvider>
        <DashboardContextProvider>
          <CalculationsContextProvider>{children}</CalculationsContextProvider>
        </DashboardContextProvider>
      </AccountsContextProvider>
    </BitmexContextProvider>
  )
}

export { ContextProviders }
