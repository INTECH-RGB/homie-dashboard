import clor from 'clor'
import {EOL} from 'os'

export const LOG_LEVELS = {
  FATAL: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4
}

class Log {
  constructor () {
    this.logLevel = LOG_LEVELS.INFO
  }

  setLevel (logLevel) {
    this.logLevel = logLevel
  }

  print (text) {
    process.stdout.write(text + EOL)
  }

  log (message, meta, type) {
    let output = this._getDate()
    output += ' | ' + this._getColoredType(type)
    output += ' '
    output += (undefined !== message ? message : '')
    if (meta && Object.keys(meta).length) {
      output += EOL
      let stringify = JSON.stringify(meta, null, 2)
      let splitted = stringify.split('\n')
      splitted.forEach(function (line, index) {
        output += '  ' + line
        if (index < splitted.length - 1) {
          output += EOL
        }
      })
    }
    this.print(output)
  }

  fatal (message, meta) {
    if (this.logLevel >= LOG_LEVELS.FATAL) {
      return this.log(message, meta, LOG_LEVELS.FATAL)
    }
  }

  error (message, meta) {
    if (this.logLevel >= LOG_LEVELS.ERROR) {
      return this.log(message, meta, LOG_LEVELS.ERROR)
    }
  }

  warn (message, meta) {
    if (this.logLevel >= LOG_LEVELS.WARN) {
      return this.log(message, meta, LOG_LEVELS.WARN)
    }
  }

  info (message, meta) {
    if (this.logLevel >= LOG_LEVELS.INFO) {
      return this.log(message, meta, LOG_LEVELS.INFO)
    }
  }

  debug (message, meta) {
    if (this.logLevel >= LOG_LEVELS.DEBUG) {
      return this.log(message, meta, LOG_LEVELS.DEBUG)
    }
  }

  _getDate () {
    const pad = n => n < 10 ? '0' + n : n
    const date = new Date()
    return date.getUTCFullYear() + '-' +
      pad(date.getUTCMonth() + 1) + '-' +
      pad(date.getUTCDate()) + ' ' +
      pad(date.getUTCHours()) + ':' +
      pad(date.getUTCMinutes()) + ':' +
      pad(date.getUTCSeconds())
  }

  _getColoredType (type) {
    switch (type) {
      case LOG_LEVELS.FATAL:
        return clor.inverse.bold.red('fatal:').toString()
      case LOG_LEVELS.ERROR:
        return clor.red('error:').toString()
      case LOG_LEVELS.WARN:
        return clor.yellow(' warn:').toString()
      case LOG_LEVELS.INFO:
        return clor.cyan(' info:').toString()
      case LOG_LEVELS.DEBUG:
        return clor.underline.white('debug:').toString()
      default:
        return '  log:'
    }
  }
}

export default new Log()
