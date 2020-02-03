import css from "../css/app.css"
import "phoenix_html"
import socket from "./socket"
import {hydrateClient} from 'react_render/priv/client'
import App from "./components/App"

const COMPONENTS = {
  App,
}

function getComponentFromStringName(name) {
  return COMPONENTS[name] || null
}

hydrateClient(getComponentFromStringName)
