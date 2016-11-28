import {EventEmitter} from 'events'

import {generateMessage, parseMessage, MESSAGE_TYPES} from '../../common/ws-messages'
import {INFRASTRUCTURE} from '../../common/events'

export default class Client extends EventEmitter {
  constructor (opts) {
    super()

    this.$deps = opts.$deps
    this.ws = opts.ws
    this.mqttClient = opts.mqttClient
    this.infrastructure = opts.infrastructure

    this.ws.send(generateMessage({ type: MESSAGE_TYPES.EVENT, event: INFRASTRUCTURE, value: this.infrastructure.toJSON() }))

    this.ws.on('message', data => {
      const message = parseMessage(data)
      this.onMessage(message)
    })

    this.ws.on('close', () => {
      this.emit('close')
    })
  }

  _sendResponse (request, value) {
    this.ws.send(generateMessage({ type: MESSAGE_TYPES.RESPONSE, id: request.id, value }))
  }

  async onMessage (message) {
    if (message.type !== MESSAGE_TYPES.REQUEST) return

    /* Handle requests */

    if (message.method === 'setState') {
      const deviceId = message.parameters.deviceId
      const nodeId = message.parameters.nodeId
      const property = message.parameters.property
      const value = message.parameters.value

      this.mqttClient.publish(`homie/${deviceId}/${nodeId}/${property}/set`, value, { qos: 1, retain: true })

      this._sendResponse(message, true)
    }
  }
}
