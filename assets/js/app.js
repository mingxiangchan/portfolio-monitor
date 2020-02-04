import antdcss from 'antd/dist/antd.css'
import css from "../css/app.css"
import React from "react"
import ReactDOM from 'react-dom'

import "phoenix_html"
import socket from "./socket"
import App from "./containers/App"

ReactDOM.render(<App />, document.querySelector("#react-app-root"))

