import React, { useState } from 'react'
import { Button } from 'antd'
import AccUpdateForm from './AccUpdateForm'
import { BitmexAcc } from '../types'

interface PropTypes {
  acc: BitmexAcc
}

const AccUpdateModal: React.FunctionComponent<PropTypes> = ({
  acc,
}: PropTypes) => {
  const [visible, setVisible] = useState(false)
  const onClick = (): void => {
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
