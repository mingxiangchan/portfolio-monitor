import React from 'react'
import {Layout, Menu} from 'antd'
import AccCreateModal from './AccCreateModal'

const {Header} = Layout

const TopNav = () => (
  <Header style={{position: 'fixed', zIndex: 1, width: '100%', height: "50px"}}>
    <Menu
      theme="dark"
      mode="horizontal"
    >
      <AccCreateModal />
    </Menu>
  </Header>
)

export default TopNav
