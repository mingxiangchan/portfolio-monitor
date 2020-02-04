import {FormComponentProps} from "antd/es/form";

export interface ModalFormProps extends FormComponentProps {
  visible: boolean;
  setVisible: (boolean) => void;
}
