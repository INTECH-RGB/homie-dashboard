import YeelightSearch from 'yeelight-wifi'

export default function start (opts) {
  const { settings, log, mqttClient } = opts

  const yeelightSearch = new YeelightSearch()
  yeelightSearch.on('found', async (light) => {
    log.info(`yeelight found ID ${light.getId()}`)
  })
}
