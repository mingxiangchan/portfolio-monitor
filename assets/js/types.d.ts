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
  wallet_balance_btc: number
  wallet_balance_usd: number
  btc_price: string
  inserted_at: string
}

export interface BitmexAcc {
  id: number
  name: string
  deposit_btc: number
  deposit_usd: number
  notes: string
  margin_balance: number
  detected_invalid: boolean
  is_testnet: boolean
  historical_data: HistoricalData[]
  avg_entry_price: string
  wallet_balance_now?: number
  wallet_balance_1_day?: number
  wallet_balance_7_days?: number
  wallet_balance_30_days?: number
  btc_price_1_day?: number
  btc_price_7_days?: number
  btc_price_30_days?: number
  // comes from bitmex WS
  unrealisedPnl?: number
  currentQty?: number
  liquidationPrice?: number
  marginBalance?: number
  avgEntryPrice?: number
  lastPrice?: number
}

export interface BitmexAccsState {
  [key: number]: BitmexAcc
}

export interface AccPropTypes {
  acc: BitmexAcc
}
