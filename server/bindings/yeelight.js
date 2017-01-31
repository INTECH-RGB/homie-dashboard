import YeelightSearch from 'yeelight-wifi'

import homieTopicParser, {TOPIC_TYPES} from '../lib/homie-topic-parser'

const BASE_TOPIC = 'homie'

const qos1Retained = { qos: 1, retain: true }

function componentToHex (c) {
  var hex = c.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}

function rgbToHex (r, g, b) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
}

export default function start (opts) {
  const { log, mqttClient } = opts

  const devicesToWatch = {}

  const yeelightSearch = new YeelightSearch()
  yeelightSearch.on('found', async (light) => {
    log.info(`yeelight found - ID ${light.getId().toString()}`)
    const deviceId = `yeelight-${light.getId()}`

    mqttClient.publish(`${BASE_TOPIC}/${deviceId}/$homie`, '2.0.0', qos1Retained)
    mqttClient.publish(`${BASE_TOPIC}/${deviceId}/$name`, 'Lumière', qos1Retained)
    mqttClient.publish(`${BASE_TOPIC}/${deviceId}/$localip`, '0.0.0.0', qos1Retained)
    mqttClient.publish(`${BASE_TOPIC}/${deviceId}/$mac`, '00:00:00:00:00:00', qos1Retained)
    mqttClient.publish(`${BASE_TOPIC}/${deviceId}/$stats/interval`, '0', qos1Retained)
    mqttClient.publish(`${BASE_TOPIC}/${deviceId}/$stats/uptime`, '0', qos1Retained)
    mqttClient.publish(`${BASE_TOPIC}/${deviceId}/$stats/signal`, '100', qos1Retained)
    mqttClient.publish(`${BASE_TOPIC}/${deviceId}/$fw/name`, 'yeelight-binding', qos1Retained)
    mqttClient.publish(`${BASE_TOPIC}/${deviceId}/$fw/version`, '1.0.0', qos1Retained)
    mqttClient.publish(`${BASE_TOPIC}/${deviceId}/$fw/checksum`, '00000000000000000000000000000000', qos1Retained)
    mqttClient.publish(`${BASE_TOPIC}/${deviceId}/$implementation`, 'yeelight', qos1Retained)

    mqttClient.publish(`${BASE_TOPIC}/${deviceId}/light/$type`, 'light', qos1Retained)
    mqttClient.publish(`${BASE_TOPIC}/${deviceId}/light/$properties`, 'color:settable,intensity:settable', qos1Retained)
    devicesToWatch[deviceId] = light
    /* for (const property of mapped.properties) {
      mqttClient.publish(`${BASE_TOPIC}/${mapped.deviceId}/${mapped.nodeId}/${property.id}`, property.value, qos1Retained)
      devicesToWatch[`${mapped.deviceId}/${mapped.nodeId}`].properties[property.id] = property
    } */

    mqttClient.publish(`${BASE_TOPIC}/${deviceId}/$online`, 'true', qos1Retained)
  })

  mqttClient.on('message', async (topic, value) => {
    const message = homieTopicParser.parse(topic, value.toString())
    if (message.type !== TOPIC_TYPES.NODE_PROPERTY_SET) return

    const light = devicesToWatch[message.deviceId]
    if (!light) return

    if (message.property === 'color') {
      const colorSplitted = message.value.split(',')
      const r = parseInt(colorSplitted[0], 10)
      const g = parseInt(colorSplitted[1], 10)
      const b = parseInt(colorSplitted[2], 10)

      try {
        await light.setRGB(rgbToHex(r, g, b))
      } catch (err) {
      }

      mqttClient.publish(`${BASE_TOPIC}/${message.deviceId}/${message.nodeId}/color`, message.value, qos1Retained)
    } else if (message.property === 'intensity') {
      const intensity = parseInt(message.value, 10)

      try {
        if (intensity === 0) await light.turnOff()
        else {
          await light.turnOn()
          await light.setBrightness(intensity)
        }
      } catch (err) {
      }
      mqttClient.publish(`${BASE_TOPIC}/${message.deviceId}/${message.nodeId}/intensity`, message.value, qos1Retained)
    }
  })
}
