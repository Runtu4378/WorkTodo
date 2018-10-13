const log4js = require('log4js')

const DEV = process.env.todoDebug

log4js.configure({
  appenders: {
    console: { type: 'console' },
    file: { type: 'file', filename: 'all-the-logs.log', maxLogSize: 10485760, backups: 3, compress: true },
  },
  categories: {
    default: { appenders: ['console'], level: 'info' },
    PRODUCT: { appenders: ['console', 'file'], level: 'error'},
  },
})

const logger = DEV ? log4js.getLogger() : log4js.getLogger('PRODUCT')

export default logger
