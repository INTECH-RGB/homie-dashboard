export const SET_IS_CONNECTED = 'SET_IS_CONNECTED'

export default function initializeStore (app) {
  app.model({
    state: {
      isConnected: false
    },
    mutations: {
      [SET_IS_CONNECTED] (state, connected) {
        state.isConnected = connected
      }
    }
  })

  let ws
  const startWebsocket = function () {
    ws = new window.WebSocket('ws://127.0.0.1:5000')
    ws.onopen = function (event) {
      app.$store.commit(SET_IS_CONNECTED, true)
    }
    ws.onclose = function (event) {
      app.$store.commit(SET_IS_CONNECTED, false)
      setTimeout(startWebsocket, 2000)
    }
  }

  startWebsocket()
}
