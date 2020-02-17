import React, { useState } from 'react'
import { Button } from 'antd'
import AccCreateForm from './AccCreateForm'

const AccCreateModal: React.FunctionComponent = () => {
  const [visible, setVisible] = useState(false)

  return (
    <>
      <Button
        type="primary"
        onClick={(): void => {
          setVisible(!visible)
        }}
      >
        Add Account
      </Button>
      <AccCreateForm visible={visible} setVisible={setVisible} />
    </>
  )
}

export default AccCreateModal
