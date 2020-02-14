import axios from 'axios'
import {message} from 'antd'

export const doPost = (url: string, data: any, callback: (arg0: any) => void) => {
  axios.post(url, data, {withCredentials: true})
    .then(callback)
    .catch(error => {
      const {errors} = error.response.data
      message.error(`Error: ${JSON.stringify(errors)}`)
    })
}

export const doPut = (url: string, data: any, callback: (arg0: any) => void) => {
  axios.put(url, data, {withCredentials: true})
    .then(callback)
    .catch(error => {
      const {errors} = error.response.data
      message.error(`Error: ${JSON.stringify(errors)}`)
    })
}

export const doDelete = (url: string, callback: (arg0: any) => void) => {
  axios.delete(url, {withCredentials: true})
    .then(callback)
    .catch(error => {
      const {errors} = error.response.data
      message.error(`Error: ${JSON.stringify(errors)}`)
    })
}
