const config = require('../dist/config')
const startFunc = require('../dist/action/start')
const addFunc = require('../dist/action/add')
const setFunc = require('../dist/action/set')
const finFunc = require('../dist/action/fin')
const delFunc = require('../dist/action/del')
const listFunc = require('../dist/action/list')
const ribaoFunc = require('../dist/action/ribao')
const endFunc = require('../dist/action/end')

module.exports = function (action, argv) {
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
  if (action === START) {
    return startFunc(argv)
  } else if (action === ADD) {
    console.log(argv)
    const content = argv['_'][1]
    if (!content) {
      console.log('the content of task is required')
      process.exit(1)
    }
    const obj = {
      content,
      isPrivate: argv.isPrivate,
      conf: {
        link: argv.link,
        time: argv.time,
        remark: argv.remark,
      },
    }
    return addFunc(obj)
  } else if (action === SET) {
    console.log(argv)
    const id = argv['_'][1]
    if (!id) {
      console.log('the id of task is required')
      process.exit(1)
    }
    const obj = {}
    if (argv.isPrivate !== undefined) {
      obj.isPrivate = argv.isPrivate
    }
    if (argv.content !== undefined) {
      obj.content = argv.content
    }
    if (argv.finish !== undefined) {
      obj.finish = argv.finish
    }
    if (argv.link !== undefined) {
      obj.conf.link = argv.link
    }
    if (argv.time !== undefined) {
      obj.conf.time = argv.time
    }
    if (argv.remark !== undefined) {
      obj.conf.remark = argv.remark
    }
    return setFunc(id, obj)
  } else if (action === FIN) {
    const id = argv['_'][1]
    return finFunc(id)
  } else if (action === DEL) {
    const id = argv['_'][1]
    return delFunc(id)
  } else if (action === LIST) {
    return listFunc()
  } else if (action === RIBAO) {
    return ribaoFunc()
  } else if (action === END) {
    return endFunc()
  }
}
