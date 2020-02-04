import React from 'react'
import {Layout, Menu} from 'antd'

const {Sider} = Layout

const SideNav = () => (
  <Sider
    width={200}
    style={{
      overflow: 'auto',
      height: '100vh',
      position: 'fixed',
      left: 0,
    }}
  >
    <Menu
      mode="inline"
      style={{height: '100%', borderRight: 0}}
    >
      <Menu.Item key="1">option1</Menu.Item>
      <Menu.Item key="2">option2</Menu.Item>
      <Menu.Item key="3">option3</Menu.Item>
      <Menu.Item key="4">option4</Menu.Item>
    </Menu>
  </Sider>
)

export default SideNav
