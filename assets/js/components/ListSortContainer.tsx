import React from 'react'
import styled from 'styled-components'
import { Card } from 'antd'
import ListSort from './ListSort'
import { COLORS } from '../constants/styles'

const dataArray = [
  {
    title: 'Senior Product Designer',
  },
  {
    title: 'Senior Animator',
  },
  {
    title: 'Visual Designer',
  },
  {
    title: 'Computer Engineer',
  },
  {
    title:
      'Phasellus porta primis malesuada aenean curabitur euismod leo sodales aliquam, auctor interdum vivamus porttitor pulvinar risus urna dignissim lectus proin, est penatibus enim consequat nibh cubilia sociis hac. Tristique maecenas vitae nibh dis justo cras consequat dictumst tempor condimentum ridiculus felis euismod porttitor, iaculis mus mattis blandit dolor habitant lacus magna purus adipiscing scelerisque mi. Mus tempus egestas tempor commodo curabitur venenatis augue montes praesent laoreet turpis felis consequat vitae etiam urna eleifend, id dignissim maecenas porttitor himenaeos pulvinar dolor ',
  },
  {
    title: 'sdfasdfasdfasdf',
  },
]

const Wrapper = styled.div`
  cursor: url('http://gtms02.alicdn.com/tps/i2/T1_PMSFLBaXXcu5FDa-20-20.png') 10
      10,
    pointer !important;
  position: relative;
  overflow: hidden;

  .card {
    margin-bottom: 10px;
    min-height: 200px;
    background: ${COLORS.lightBg};
    border-radius: 4px;
  }
`

const ListSortContainer = () => {
  return (
    <Wrapper>
      <ListSort
        dragClassName="list-drag-selected"
        appearAnim={{ animConfig: { marginTop: [5, 30], opacity: [1, 0] } }}
      >
        {dataArray.map((item, i) => {
          return (
            <Card key={i} className="card">
              {item.title}
            </Card>
          )
        })}
      </ListSort>
    </Wrapper>
  )
}

export default ListSortContainer
