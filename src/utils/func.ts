import logger from './logger'

const config = require('../config')

// 100以内数字转换为两位数的string
export const numToStr2 = (num: number): string => {
  let res
  if (num < 0) {
    throw new Error(`num range: ${num} error(num>=0)`)
  } else if (num < 10) {
    res = `0${num}`
  } else {
    res = `${num}`
  }
  return res
}

export const echoStyle = (type: string, str: string) => {
  const typeList = {
    'bold'          : ['\x1B[1m',  '\x1B[22m'],
    'italic'        : ['\x1B[3m',  '\x1B[23m'],
    'underline'     : ['\x1B[4m',  '\x1B[24m'],
    'inverse'       : ['\x1B[7m',  '\x1B[27m'],
    'strikethrough' : ['\x1B[9m',  '\x1B[29m'],
    'white'         : ['\x1B[37m', '\x1B[39m'],
    'grey'          : ['\x1B[90m', '\x1B[39m'],
    'black'         : ['\x1B[30m', '\x1B[39m'],
    'blue'          : ['\x1B[34m', '\x1B[39m'],
    'cyan'          : ['\x1B[36m', '\x1B[39m'],
    'green'         : ['\x1B[32m', '\x1B[39m'],
    'magenta'       : ['\x1B[35m', '\x1B[39m'],
    'red'           : ['\x1B[31m', '\x1B[39m'],
    'yellow'        : ['\x1B[33m', '\x1B[39m'],
    'whiteBG'       : ['\x1B[47m', '\x1B[49m'],
    'greyBG'        : ['\x1B[49;5;8m', '\x1B[49m'],
    'blackBG'       : ['\x1B[40m', '\x1B[49m'],
    'blueBG'        : ['\x1B[44m', '\x1B[49m'],
    'cyanBG'        : ['\x1B[46m', '\x1B[49m'],
    'greenBG'       : ['\x1B[42m', '\x1B[49m'],
    'magentaBG'     : ['\x1B[45m', '\x1B[49m'],
    'redBG'         : ['\x1B[41m', '\x1B[49m'],
    'yellowBG'      : ['\x1B[43m', '\x1B[49m'],
  }
  const match = typeList[type]
  if (!match) {
    throw new Error(`unknown type: ${type}`)
  } else {
    return match[0] + str + match[1]
  }
}
