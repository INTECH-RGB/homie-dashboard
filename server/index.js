import dotenv from 'dotenv'
import sqlite from 'sqlite'

import log from './lib/log'
import createWebsocketServer from './lib/websocket-server'
import start from './start'

dotenv.config()

async function wrapper () {
  log.info('starting')

  let wss
  try {
    wss = await createWebsocketServer(process.env.WS_API_IP, parseInt(process.env.WS_API_PORT, 10))
    log.info(`listening on ${process.env.WS_API_IP}:${process.env.WS_API_PORT}`)
  } catch (err) {
    log.fatal('cannot start server', err)
    process.exit(1)
  }

  let db
  try {
    db = await sqlite.open('./homie-dashboard.db')
    log.debug('database opened')
    await db.migrate()
    log.debug('database migrated')
  } catch (err) {
    log.fatal('cannot open or migrate database', err)
    process.exit(1)
  }

  start(log, wss, db)
}

wrapper().catch(function onError (err) {
  log.fatal('unhandled error', err)
  process.exit(2)
})
