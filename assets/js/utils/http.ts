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
