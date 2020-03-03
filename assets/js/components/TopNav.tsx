import React, { useState } from 'react'
import { Button, Icon } from 'antd'
import styled from 'styled-components'
import axios from 'axios'

const Nav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 30px;

  .right-nav-items {
    display: flex;
    align-items: center;
    height: 100%;

    .email {
      margin-right: 1em;
    }
  }
`

const MenuIcon = styled(Icon)`
  && {
    font-size: 1.5em;
  }
`

type TopNavProps = {
  showSider: boolean
  toggleSider: () => void
}

const TopNav = ({ showSider, toggleSider }: TopNavProps) => {
  const logoutForm = React.createRef<HTMLFormElement>()
  const [email, changeEmail] = useState<string | null>(null)

  if (!email) {
    axios.get('/api/current_user', { withCredentials: true }).then(resp => {
      changeEmail(resp.data.data.email)
    })
  }

  const logout = () => {
    logoutForm.current.submit()
  }

  return (
    <Nav>
      <MenuIcon
        type={showSider ? 'menu-fold' : 'menu-unfold'}
        onClick={toggleSider}
      />
      <div className="right-nav-items">
        <span className="email">{email}</span>
        <form action="/session" method="POST" ref={logoutForm}>
          <input name="_method" type="hidden" value="delete" />
          <input type="hidden" name="_csrf_token" value={window.csrfToken} />
          <Button type="ghost" icon="poweroff" onClick={logout}>
            Sign Out
          </Button>
        </form>
      </div>
    </Nav>
  )
}

export default TopNav
