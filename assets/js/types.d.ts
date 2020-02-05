import {FormComponentProps} from "antd/es/form";

export interface ModalFormProps extends FormComponentProps {
  visible: boolean;
  setVisible: (arg0: boolean) => void;
}

export interface AccCreateFormData {
  name: string;
  is_testnet: boolean;
  api_key: string;
  api_secret: string;
  deposit_usd: number;
  deposit_btc: number;
  notes: string;
}

export interface HistoricalData {
  walletBalanceBtc: number;
  walletBalanceUsd: number;
  btcPrice: number;
  date: string;
}

export interface BitmexAcc {
  id: number;
  name: string;
  depositBtc: number;
  depositUsd: number;
  notes: string;
  marginBalance: number
  walletBalanceNow: number;
  walletBalance24Hrs: number;
  walletBalance7Days: number;
  walletBalance30Days: number;
  historicalData: HistoricalData[];
  unrealisedPnl?: number;
  currentQty?: number;
  liquidationPrice?: number;
  avgEntryPrice?: number;
}

export interface BitmexAccsState {
  [key: number]: BitmexAcc
}
