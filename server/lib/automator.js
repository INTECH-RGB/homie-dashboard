import vm from 'vm'

export function handleAutomation ({$deps, infrastructure, mqttClient}) {
  infrastructure.on('update', async () => {
    const sandbox = {
      infrastructure: infrastructure.toJSON(),
      handleAction (opts) {
        const {deviceId, nodeId, propertyId, value} = opts

        mqttClient.publish(`homie/${deviceId}/${nodeId}/${propertyId}/set`, value, { qos: 1, retain: true })
      }
    }
    vm.createContext(sandbox)
    vm.runInContext(infrastructure.getAutomation().script, sandbox)
  })
}
