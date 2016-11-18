import createMqttClient from './lib/mqtt-client'
export default function start (log, wss, db) {
  const mqttClient = createMqttClient('mqtt://127.0.0.1:1883')
  mqttClient.on('connect', function onConnect () {
    log.info('connected to broker')
  })
}
