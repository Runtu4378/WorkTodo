const config = require('../dist/config')
const {
  MODULE_NAME,
  RIBAO
} = config

module.exports = [
  {
    content: '写日报',
    finish: false,
    isPrivate: true,
    conf: {
      link: 'https://www.baidu.com',
      command: `${MODULE_NAME} ${RIBAO}`,
    },
  }
]
