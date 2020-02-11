import axios from 'axios'


// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".

// To use Phoenix channels, the first step is to import Socket,
// and connect at the socket path in "lib/web/endpoint.ex".
//
// Pass the token on params as below. Or remove it
// from the params if you are not using authentication.
import { Socket } from "phoenix"

let socket = new Socket("/socket", { params: { _csrf_token: window.csrfToken } })

if(window.csrfToken){
  socket.connect()
}

export const generalChannel = socket.channel("general_btc_info", {})
generalChannel.join()

export let bitmexAccChannel = null;

export const afterJoinedAccChannel = callback => {
  const bmIdxChannel = socket.channel("bitmex_accs:index", {})

  bmIdxChannel.join().receive("ok", ({user_specific_topic}) => {
    const bmAccChannel = socket.channel(user_specific_topic, {})
    bmAccChannel.join()
    callback(bmAccChannel)
  })
}



// Now that you are connected, you can join channels with a topic:
// let channel = socket.channel("bitmex_acc:2", {})
// channel.join()
//   .receive("ok", resp => { console.log("Joined successfully", resp) })
//   .receive("error", resp => { console.log("Unable to join", resp) })

//channel.on("historical", resp => console.log("historical", resp))

export default socket
