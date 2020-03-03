import React from 'react'
import styled from 'styled-components'
import { Typography } from 'antd'

import { BitmexAcc } from '../types'

interface PropTypes {
  acc: BitmexAcc
}

const { Text } = Typography

const Header = styled.div`
  padding-top: 8px;
  padding-left: 10px;

  h2 {
    font-size: 1.4rem;
    margin-bottom: 4px;
    font-weight: 300;
  }

  .note {
    margin-bottom: 12px;
    font-weight: 300;
  }
`

const AccCardHeader = ({ acc }: PropTypes) => {
  return (
    <Header>
      <h2>{acc.name}</h2>
      <h4 className="note">
        <Text type="secondary">{acc.notes}</Text>
      </h4>
    </Header>
  )
}

export default AccCardHeader
