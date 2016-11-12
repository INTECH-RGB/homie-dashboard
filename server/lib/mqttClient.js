import mqtt from 'mqtt'

export default function createMqttClient (options) {
  return mqtt.connect(options)
}
