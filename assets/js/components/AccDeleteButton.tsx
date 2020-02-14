import React from 'react'
import {BitmexAcc} from '../types';
import {Icon, Popconfirm} from 'antd';
import {doDelete} from '../utils/http';

export default ({acc}: {acc: BitmexAcc}) => {
  const onConfirm = () => {
    doDelete(`/api/bitmex_accs/${acc.id}`, resp => console.log(resp))
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
