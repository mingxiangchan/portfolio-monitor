import React, { useState } from 'react'

const DashboardContext = React.createContext(null)

const DashboardContextProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const [testnet, setTestnet] = useState(true)
  return (
    <DashboardContext.Provider value={{ testnet, setTestnet }}>
      {children}
    </DashboardContext.Provider>
  )
}

export { DashboardContextProvider, DashboardContext }
