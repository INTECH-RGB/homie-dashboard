import crypto from 'crypto'
import os from 'os'
import dgram from 'dgram'

import homieTopicParser, {TOPIC_TYPES} from '../lib/homie-topic-parser'

const AQARA_IV = Buffer.from([0x17, 0x99, 0x6d, 0x09, 0x3d, 0x28, 0xdd, 0xb3, 0xba, 0x69, 0x5a, 0x2e, 0x6f, 0x58, 0x56, 0x2e])
const MULTICAST_ADDRESS = '224.0.0.50'
const SERVER_PORT = 9898

const BASE_TOPIC = 'homie'

const serverSocket = dgram.createSocket('udp4')
const qos1Retained = { qos: 1, retain: true }

export default function start (opts) {
  const { settings, log, mqttClient } = opts

  const devicesToWatch = {}
  let gatewaySid = null
  let gatewayToken = null

  serverSocket.on('listening', function () {
    log.info('aqara binding listening')
    Object.values(os.networkInterfaces()).forEach(function (iface) {
      iface.forEach(function (connection) {
        if (connection.family === 'IPv4') serverSocket.addMembership(MULTICAST_ADDRESS, connection.address)
      })
    })
    log.info('aqara binding registered to multicast')

    const payload = '{"cmd": "get_id_list"}'
    serverSocket.send(payload, 0, payload.length, SERVER_PORT, settings.gateway.ip)
  })

  serverSocket.on('message', function (message) {
    message = JSON.parse(message.toString())

    let sid = null
    let type = null
    let state = null
    let mapped = null
    switch (message.cmd) {
      case 'heartbeat':
        gatewaySid = message.sid
        gatewayToken = message.token
        break
      case 'get_id_list_ack':
        gatewaySid = message.sid
        gatewayToken = message.token
        // read gateway
        const payload = `{"cmd": "read", "sid": "${gatewaySid}"}`
        serverSocket.send(payload, 0, payload.length, SERVER_PORT, settings.gateway.ip)
        // read subdevices
        for (const sid of JSON.parse(message.data)) {
          const payload = `{"cmd": "read", "sid": "${sid}"}`
          serverSocket.send(payload, 0, payload.length, SERVER_PORT, settings.gateway.ip)
        }
        break
      case 'read_ack':
        sid = message.sid
        type = message.model
        state = JSON.parse(message.data)

        mapped = mapToHomie({ sid, type, state })

        mqttClient.publish(`${BASE_TOPIC}/${mapped.deviceId}/$homie`, '2.0.0', qos1Retained)
        mqttClient.publish(`${BASE_TOPIC}/${mapped.deviceId}/$name`, mapped.deviceName, qos1Retained)
        mqttClient.publish(`${BASE_TOPIC}/${mapped.deviceId}/$localip`, settings.gateway.ip, qos1Retained)
        mqttClient.publish(`${BASE_TOPIC}/${mapped.deviceId}/$mac`, '00:00:00:00:00:00', qos1Retained)
        mqttClient.publish(`${BASE_TOPIC}/${mapped.deviceId}/$stats/interval`, '0', qos1Retained)
        mqttClient.publish(`${BASE_TOPIC}/${mapped.deviceId}/$stats/uptime`, '0', qos1Retained)
        mqttClient.publish(`${BASE_TOPIC}/${mapped.deviceId}/$stats/signal`, '100', qos1Retained)
        mqttClient.publish(`${BASE_TOPIC}/${mapped.deviceId}/$fw/name`, 'aqara-binding', qos1Retained)
        mqttClient.publish(`${BASE_TOPIC}/${mapped.deviceId}/$fw/version`, '1.0.0', qos1Retained)
        mqttClient.publish(`${BASE_TOPIC}/${mapped.deviceId}/$fw/checksum`, '00000000000000000000000000000000', qos1Retained)
        mqttClient.publish(`${BASE_TOPIC}/${mapped.deviceId}/$implementation`, 'aqara', qos1Retained)

        mqttClient.publish(`${BASE_TOPIC}/${mapped.deviceId}/${mapped.nodeId}/$type`, mapped.nodeType, qos1Retained)
        mqttClient.publish(`${BASE_TOPIC}/${mapped.deviceId}/${mapped.nodeId}/$properties`, mapped.nodeProperties, qos1Retained)
        devicesToWatch[`${mapped.deviceId}/${mapped.nodeId}`] = {
          type: mapped.nodeType,
          properties: {}
        }
        for (const property of mapped.properties) {
          mqttClient.publish(`${BASE_TOPIC}/${mapped.deviceId}/${mapped.nodeId}/${property.id}`, property.value, qos1Retained)
          devicesToWatch[`${mapped.deviceId}/${mapped.nodeId}`].properties[property.id] = property
        }

        mqttClient.publish(`${BASE_TOPIC}/${mapped.deviceId}/$online`, 'true', qos1Retained)

        break
      case 'report':
        sid = message.sid
        type = message.model
        state = JSON.parse(message.data)

        mapped = mapToHomie({ sid, type, state })

        for (const property of mapped.properties) {
          mqttClient.publish(`${BASE_TOPIC}/${mapped.deviceId}/${mapped.nodeId}/${property.id}`, property.value, qos1Retained)
          devicesToWatch[`${mapped.deviceId}/${mapped.nodeId}`].properties[property.id] = property
        }

        break
    }
  })

  mqttClient.on('message', (topic, value) => {
    const message = homieTopicParser.parse(topic, value.toString())
    if (message.type !== TOPIC_TYPES.NODE_PROPERTY_SET) return

    const device = devicesToWatch[`${message.deviceId}/${message.nodeId}`]
    if (!device) return

    const cipher = crypto.createCipheriv('aes-128-cbc', settings.gateway.password, AQARA_IV)
    const key = cipher.update(gatewayToken, 'ascii', 'hex')
    cipher.final('hex') // useless

    switch (device.type) {
      case 'light':
        const initialColorSplitted = device.properties.color.value.split(',')
        const initialIntensity = parseInt(device.properties.intensity.value, 10)
        let r = null
        let g = null
        let b = null
        let a = null
        if (message.property === 'color') {
          const colorSplitted = message.value.split(',')
          r = parseInt(colorSplitted[0], 10)
          g = parseInt(colorSplitted[1], 10)
          b = parseInt(colorSplitted[2], 10)
          a = initialIntensity
        } else if (message.property === 'intensity') {
          r = parseInt(initialColorSplitted[0], 10)
          g = parseInt(initialColorSplitted[1], 10)
          b = parseInt(initialColorSplitted[2], 10)
          a = parseInt(message.value, 10)
        }

        const buf = Buffer.alloc(4)
        buf.writeUInt8(a, 0)
        buf.writeUInt8(r, 1)
        buf.writeUInt8(g, 2)
        buf.writeUInt8(b, 3)

        const value = buf.readUInt32BE()

        const payload = `{ "cmd": "write", "model": "gateway", "sid": "${gatewaySid}", "short_id": 0, "data": "{\\"rgb\\":${value}, \\"key\\": \\"${key}\\"}" }`
        serverSocket.send(payload, 0, payload.length, SERVER_PORT, settings.gateway.ip)
        break
    }
  })

  serverSocket.bind(SERVER_PORT, '0.0.0.0')
}

function mapToHomie (opts) {
  const { sid, type, state } = opts

  const toReturn = {
    deviceId: `aqara-${sid}`,
    deviceName: null,
    nodeId: null,
    nodeType: null,
    nodeProperties: null,
    properties: []
  }

  switch (type) {
    case 'gateway':
      Object.assign(toReturn, {
        deviceName: 'Lumière passerelle',
        nodeId: 'light',
        nodeType: 'light',
        nodeProperties: 'color:settable,intensity:settable'
      })
      const buf = Buffer.alloc(4)
      buf.writeUInt32BE(state.rgb)
      const r = buf.readUInt8(1)
      const g = buf.readUInt8(2)
      const b = buf.readUInt8(3)
      const a = buf.readUInt8(0) // 0-100
      toReturn.properties.push({ id: 'color', value: `${r},${g},${b}` })
      toReturn.properties.push({ id: 'intensity', value: a.toString() })
      break
    case 'magnet':
      Object.assign(toReturn, {
        deviceName: 'Porte',
        nodeId: 'door',
        nodeType: 'door',
        nodeProperties: 'open'
      })
      toReturn.properties.push({ id: 'open', value: state.status === 'open' ? '1' : '0' })
      break
    case 'switch':
      Object.assign(toReturn, {
        deviceName: 'Bouton',
        nodeId: 'button',
        nodeType: 'button',
        nodeProperties: 'pressed'
      })
      toReturn.properties.push({ id: 'pressed', value: state.status === 'long_click_press' ? '1' : '0' })
      break
  }

  return toReturn
}
