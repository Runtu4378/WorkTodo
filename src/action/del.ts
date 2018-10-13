import logger from '../utils/logger'
import Archive from '../obj/archive'

const config = require('../config')

const {
  MODULE_NAME,
  FIN,
} = config

module.exports = function(id) {
  const today = new Date()
  logger.info(`today is ${today}`)
  logger.info('init archive object')
  const archive = new Archive(today)
  if (!archive.today.hadCreate) {
    // 未创建存档
    logger.error(`you need to create today archive first. run: ${MODULE_NAME} ${START}`)
    process.exit(1)
  } else {
    // 已创建存档
    archive.delTask(id)
      .catch(e => {
        // 全局的错误处理
        logger.error(e.message)
        process.exit(1)
      })
  }
}
