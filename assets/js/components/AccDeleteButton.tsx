import React from 'react'
import { BitmexAcc } from '../types'
import { Icon, Popconfirm } from 'antd'
import { doDelete } from '../utils/http'

interface PropTypes {
  acc: BitmexAcc
}

const AccDeleteForm: React.FunctionComponent<PropTypes> = ({ acc }) => {
  const onConfirm = (): void => {
    doDelete(`/api/bitmex_accs/${acc.id}`, (resp): void => console.log(resp))
  }

  return (
    <Popconfirm
      title="Are you sure you want to delete this account"
      onConfirm={onConfirm}
    >
      <Icon type="delete" />
    </Popconfirm>
  )
}

export default AccDeleteForm
