import React, { useState } from 'react'
import { Button } from 'antd'
import styled from 'styled-components'
import AccCreateForm from './AccCreateForm'

const AddAccBtn = styled(Button)`
  && {
    position: absolute;
    bottom: 2em;
    left: 50%;
    transform: translateX(-50%);
  }
`

const AccCreateModal: React.FunctionComponent = () => {
  const [visible, setVisible] = useState(false)

  return (
    <>
      <AddAccBtn
        ghost
        icon="plus"
        type="dashed"
        onClick={(): void => {
          setVisible(!visible)
        }}
      >
        Add Account
      </AddAccBtn>
      <AccCreateForm visible={visible} setVisible={setVisible} />
    </>
  )
}

export default AccCreateModal
