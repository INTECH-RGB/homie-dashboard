#!/usr/bin/env node

'use strict'

import ip from 'internal-ip'
import c from 'clor/c'
import yargs from 'yargs'

import {bootstrap} from '../index'
import {hash} from '../lib/hash'
import pkg from '../../package'

const argv = yargs
  .usage('Usage: $0 [options]')
  .version()
  .strict()
  .demandCommand(1)
  .command('hash <password>', 'Hash a password')
  .command('start', 'Start Homie Dashboard', (yargs) => {
    yargs.option('ip', {
      describe: 'IP you want to listen to. Defaults to 127.0.0.1'
    })
    .option('port', {
      describe: 'Port you want to listen to. Defaults to 35589'
    })
    .option('dataDir', {
      describe: "Top directory you want Homie's data to be stored in. Defaults to CWD"
    })
    .option('logLevel', {
      describe: 'Minimum log level for console output. Defaults to info'
    })
  })
  .help()
  .locale('en')
  .argv

const wrapper = async function () {
  switch (argv._[0]) {
    case 'hash':
      console.log(await hash(argv.password))
      break
    case 'start':
      // Font: Dr Pepper
      const homieStyled = c`<magenta>\
       _____           _        ____          _   _                 _
      |  |  |___ _____|_|___   |    \\ ___ ___| |_| |_ ___ ___ ___ _| |
      |     | . |     | | -_|  |  |  | .'|_ -|   | . | . | .'|  _| . |
      |__|__|___|_|_|_|_|___|  |____/|__,|___|_|_|___|___|__,|_| |___|
      </magenta>`

      console.log(homieStyled)
      console.log(c`<magenta>Version <bold>${pkg.version}</bold></magenta>\n`)
      console.log(c`<magenta>See <underline>https://github.com/INTECH-RGB/homie-dashboard</underline></magenta>\n`)
      console.log(c`<magenta>Homie Dashboard IP is <bold><underline>${ip.v4()}</underline></bold></magenta>`)
      console.log(c`<magenta>Make sure this IP won't change over time</magenta>\n`)

      bootstrap({
        ip: argv.ip || '127.0.0.1',
        port: parseInt(argv.port, 10) || 35589,
        dataDir: argv.dataDir || './',
        logLevel: argv.logLevel ? argv.logLevel.toUpperCase() : 'INFO'
      })
      break
  }
}
wrapper()
