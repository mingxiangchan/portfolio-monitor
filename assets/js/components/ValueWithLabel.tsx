import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import { Statistic } from 'antd'
import { StatisticProps } from 'antd/lib/statistic/Statistic'

const NA = '<span class="na">NA</span>'

interface PropTypes extends StatisticProps {
  small?: boolean
}

const StyledStatistic = styled(Statistic)`
  && {
    margin-bottom: 12px;

    span.na {
      color: #7d7d7d;
      font-weight: 300;
      font-size: 0.8em;
      letter-spacing: 2px;
    }

    .ant-statistic-title {
      font-size: ${props => (props.small ? '13px' : '14px')};
    }

    .ant-statistic-content {
      font-size: ${props => (props.small ? '15px' : '18px')};
    }
  }
`

function createMarkup(value: string) {
  return {
    __html: value
      .toString()
      .replace(/NaN/g, NA)
      .replace(/null/g, NA),
  }
}

const ValueWithLabel: FunctionComponent<PropTypes> = props => {
  return (
    <StyledStatistic
      {...props}
      formatter={value => (
        <span dangerouslySetInnerHTML={createMarkup(value)} />
      )}
    />
  )
}

export default ValueWithLabel
