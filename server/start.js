import createMqttClient from './lib/mqtt-client'
export default function start ($deps) {
  const mqttClient = createMqttClient(`mqtt://${$deps.settings.mqtt.host}:${$deps.settings.mqtt.port}`)
  mqttClient.on('connect', function onConnect () {
    $deps.log.info('connected to broker')
  })
}
