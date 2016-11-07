import bunyan from 'bunyan'
import pkg from '../../package'

const log = bunyan.createLogger({ name: pkg.name })

export default log
