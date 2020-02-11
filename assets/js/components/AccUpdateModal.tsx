import React, {useState} from 'react'
import {Button} from 'antd'
import AccUpdateForm from './AccUpdateForm'
import {BitmexAcc} from '../types'

const AccUpdateModal = ({acc}: BitmexAcc) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          setVisible(!visible);
        }}
      >
        Edit
      </Button>
      <AccUpdateForm visible={visible} setVisible={setVisible} acc={acc}/>
    </>
  );
};

export default AccUpdateModal
