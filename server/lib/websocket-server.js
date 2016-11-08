import {createServer} from 'http'
import {Server as WebSocketServer} from 'ws'

export default function createWebsocketServer (ip, port) {
  return new Promise((resolve, reject) => {
    const httpServer = createServer()
    const wss = new WebSocketServer({ server: httpServer })

    httpServer.listen(port, ip).on('listening', function onListening () {
      resolve(wss)
    }).on('error', function onError (err) {
      reject(err)
    })
  })
}
