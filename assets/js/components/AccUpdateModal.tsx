import React, { useState } from 'react'
import { Button, Icon } from 'antd'
import AccUpdateForm from './AccUpdateForm'
import { BitmexAcc } from '../types'

const AccUpdateModal = ({ acc }: { acc: BitmexAcc }) => {
  const [visible, setVisible] = useState(false)
  const onClick = () => {
    setVisible(!visible)
  }

  return (
    <>
      <Button type="primary" shape="circle" icon="edit" onClick={onClick} />
      <AccUpdateForm visible={visible} setVisible={setVisible} acc={acc} />
    </>
  )
}

export default AccUpdateModal
