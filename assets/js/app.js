import React from "react"
import ReactDOM from 'react-dom'

import "phoenix_html"
import socket from "./socket"
import App from "./components/App"

ReactDOM.render(<App />, document.querySelector("#react-app-root"))

