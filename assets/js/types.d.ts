import { FormComponentProps } from 'antd/es/form'

export interface ModalFormProps extends FormComponentProps {
  visible: boolean
  setVisible: (arg0: boolean) => void
}

export interface UpdateModalFormProps extends ModalFormProps {
  acc: BitmexAcc
}

export interface AccCreateFormData {
  name: string
  is_testnet: boolean
  api_key: string
  api_secret: string
  deposit_usd: number
  deposit_btc: number
  notes: string
}

export type AccUpdateFormData = AccCreateFormData

export interface HistoricalData {
  avg_entry_price: number
  margin_balance: number
  wallet_balance_btc: number
  wallet_balance_usd: number
  btc_price: string
  inserted_at: string
}

export interface BitmexAcc {
  id: number
  name: string
  // comes from server
  deposit_btc: number
  deposit_usd: number
  notes: string
  detected_invalid: boolean
  is_testnet: boolean
  historical_data: HistoricalData[]

  // state maintained on FE
  pendingFirstQuery: boolean
  avgEntryPrice: number
  balance1day: HistoricalData
  balance7days: HistoricalData
  balance30days: HistoricalData
  currentQty: number
  fiatBalance: number
  lastPrice: number
  liquidationPrice: number
  marginBalance: number
  unrealisedPnl: number
  walletBalance: number
}

export interface BitmexAccsState {
  [key: number]: BitmexAcc
}

export interface AccPropTypes {
  acc: BitmexAcc
}

export interface CummulativeTotal {
  btcPrice: string
  btcBalance: number
}

export interface CummulativeTotals {
  [key: string]: CummulativeTotal
}

export interface StatisticType {
  percentValue?: number
  absoluteValue?: number
  isPositive?: boolean
  symbol: string
  precision: number
}

export interface BitmexWsMarginDetails {
  acc_id: number
  data: {
    unrealisedPnl: number
    marginBalance: number
    walletBalance: number
  }[]
}

export interface BitmexWsPositionDetails {
  acc_id: number
  data: {
    currentQty: number
    liquidationPrice: number
    avgEntryPrice: number
  }[]
}
