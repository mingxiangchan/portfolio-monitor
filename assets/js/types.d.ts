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
