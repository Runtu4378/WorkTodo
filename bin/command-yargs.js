const config = require('../dist/config')
const actionModule = require('./action-deal')

module.exports = function (yargs) {
  const {
    MODULE_NAME,
    START,
    ADD,
    SET,
    FIN,
    DEL,
    LIST,
    RIBAO,
    END,
  } = config

  const operation = (action, argv) => {
    // console.log(action)
    // console.log(argv)
    // DEBUG 模式
    if (argv.debug) {
      // 设定 debug 全局变量
      process.env.todoDebug = true
    }
    actionModule(action, argv)
  }

  // DEBUG 模式
  yargs.options('debug', {
    describe: 'open DEBUG mode',
  })

  // 开工指令
  yargs.command(
    START,
    '开启今天的工作存档',
    () => {},
    argv => operation(START, argv),
  )

  // 新增待办指令
  yargs.command(
    [ADD, 'a'],
    '新增待办',
    {
      'link': {
        alias: 'l',
        type: 'string',
        describe: '待办相关的链接',
      },
      'time': {
        alias: 't',
        type: 'string',
        describe: '待办相关的时间',
      },
      'remark': {
        alias: 'r',
        type: 'string',
        describe: '备注'
      },
      'isPrivate': {
        alias: 'p',
        default: false,
        describe: '是否为私人事务（私人事务不显示在日报中，也不妨碍收工结算）'
      },
    },
    argv => operation(ADD, argv),
  )

  // 更新待办指令
  yargs.command(
    [SET, 's'],
    '更新待办',
    {
      'content': {
        alias: 'c',
        type: 'string',
        describe: '要更新的内容',
      },
      'link': {
        alias: 'l',
        type: 'string',
        describe: '要更新的链接',
      },
      'time': {
        alias: 't',
        type: 'string',
        describe: '要更新的时间',
      },
      'remark': {
        alias: 'r',
        type: 'string',
        describe: '要更新的备注',
      },
      'isPrivate': {
        alias: 'p',
        type: 'boolean',
        describe: '是否为私人事务（私人事务不显示在日报中，也不妨碍收工结算）',
      },
      'finish': {
        alias: 'f',
        type: 'boolean',
        default: false,
        describe: 'true 为已完成，默认为未完成',
      },
    },
    argv => operation(SET, argv),
  )

  // 完成待办指令
  yargs.command(
    [FIN, 'f'],
    '完成待办',
    () => {},
    argv => operation(FIN, argv),
  )

  // 删除待办指令
  yargs.command(
    [DEL, 'd'],
    '删除待办',
    () => {},
    argv => operation(DEL, argv),
  )

  // 显示待办指令
  yargs.command(
    [LIST, 'l'],
    '显示待办列表',
    () => {},
    argv => operation(LIST, argv)
  )

  // 显示日报
  yargs.command(
    RIBAO,
    '显示并复制日报',
    () => {},
    argv => operation(RIBAO, argv)
  )

  // 收工
  yargs.command(
    END,
    '收工并输出日报',
    () => {},
    argv => operation(END, argv)
  )
}
