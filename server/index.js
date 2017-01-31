import path from 'path'
import Knex from 'knex'
import {bookshelf} from './lib/database'
import log, {LOG_LEVELS} from './lib/log'
import createWebsocketServer from './lib/websocket-server'
import start from './start'
import loadSettings from './lib/settings'
import {validate as validateSettings} from './lib/validators/settings'
import SettingModel from './models/setting'

export async function bootstrap (opts) {
  if (typeof LOG_LEVELS[opts.logLevel] === undefined) {
    log.fatal(`log level ${opts.logLevel} does not exist`)
    process.exit(1)
  }
  log.setLevel(LOG_LEVELS[opts.logLevel])

  log.info('starting')

  let settings
  try {
    settings = await loadSettings(opts.dataDir)
    const validated = validateSettings(settings)
    if (!validated.valid) {
      log.fatal('invalid settings', validated.errors)
      process.exit(1)
    }
    log.info('settings loaded')
  } catch (err) {
    log.fatal('cannot load settings', err)
    process.exit(1)
  }

  const knex = new Knex({
    client: 'sqlite3',
    connection: {
      filename: path.join(opts.dataDir, './homie-dashboard.db')
    },
    useNullAsDefault: true
  })
  bookshelf.knex = knex

  try {
    await knex.raw('PRAGMA foreign_keys=ON')
    await knex.raw('PRAGMA locking_mode=EXCLUSIVE')
    await knex.raw('PRAGMA synchronous=NORMAL')
    await knex.migrate.latest({ directory: path.join(__dirname, '/migrations') })
    log.debug('database migrated')
    const otpSecretModel = await SettingModel.forge({ key: 'otp_secret' }).fetch()
    const qrCodeSecret = otpSecretModel.attributes['value']
    const qrCodeData = `otpauth://totp/HomieDashboard?secret=${qrCodeSecret}`
    log.info(`copy this into a web browser to add the secure key: https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrCodeData)}`)
  } catch (err) {
    log.fatal('cannot open or migrate database', err)
    process.exit(1)
  }

  let wss
  try {
    wss = await createWebsocketServer({ ip: opts.ip, port: opts.port, settings })
    log.info(`listening on ${opts.ip}:${opts.port}`)
  } catch (err) {
    log.fatal('cannot start server', err)
    process.exit(1)
  }

  start({ log, wss, settings })
}
