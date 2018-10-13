import logger from '../utils/logger'
import Archive from '../obj/archive'

module.exports = function () {
  // 检查今天是否已开启存档
  const today = new Date()
  logger.info(`today is ${today}`)
  logger.info('init archive object')
  const archive = new Archive(today)
  // 创建存档，读取默认待办
  // 读取昨天新增待办
  // 生成存档
  // 显示结果信息
  archive.createArchive()
    .catch(e => {
      // 全局的错误处理
      logger.error(e.message)
      process.exit(1)
    })
}
