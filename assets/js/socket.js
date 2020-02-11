import { Socket } from "phoenix"
import axios from 'axios'

const socketPromise = 
  axios.get("/api/token", {withCredentials: true})
  .then(({data: {token}}) => {
      const socket = new Socket("/socket", {params: {token: token}})
      socket.connect()
      return socket
    })

export const afterJoinedGeneralChannel = callback => {
  socketPromise.then(socket => {
    const generalChannel = socket.channel("general_btc_info")
    generalChannel.join()
    callback(generalChannel)
  })
}

export const afterJoinedAccChannel = callback => {
  socketPromise.then(socket => {
    const bmIdxChannel = socket.channel("bitmex_accs:index", {})

    bmIdxChannel.join().receive("ok", ({user_specific_topic}) => {
      const bmAccChannel = socket.channel(user_specific_topic, {})
      bmAccChannel.join()
      callback(bmAccChannel)
    })
  })
}



// Now that you are connected, you can join channels with a topic:
// let channel = socket.channel("bitmex_acc:2", {})
// channel.join()
//   .receive("ok", resp => { console.log("Joined successfully", resp) })
//   .receive("error", resp => { console.log("Unable to join", resp) })

//channel.on("historical", resp => console.log("historical", resp))
