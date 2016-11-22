import WebSocket from '../lib/websocket'
import {tryAuth} from '../services/api'

export const SET_IS_CONNECTED = 'SET_IS_CONNECTED'
export const SET_IS_AUTHENTIFIED = 'SET_IS_AUTHENTIFIED'

export default function initializeStore (app) {
  app.model({
    state: {
      isConnected: false,
      isAuthentified: false
    },
    mutations: {
      [SET_IS_CONNECTED] (state, connected) {
        state.isConnected = connected
      },
      [SET_IS_AUTHENTIFIED] (state, authentified) {
        state.isAuthentified = authentified
      }
    },
    actions: {
      async tryAuth ({commit}, password) {
        const success = await tryAuth({ ws, parameters: password })
        if (success) commit(SET_IS_AUTHENTIFIED, true)
        return success
      }
    }
  })

  const ws = new WebSocket('ws://127.0.0.1:5000')
  ws.on('open', function onOpen () {
    app.$store.commit(SET_IS_CONNECTED, true)
  }).on('close', function onClose () {
    app.$store.commit(SET_IS_CONNECTED, false)
    app.$store.commit(SET_IS_AUTHENTIFIED, false)
  })
}
