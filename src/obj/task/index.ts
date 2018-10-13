import logger from '../../utils/logger'
import {
  numToStr2,
  echoStyle,
} from '../../utils/func'

const config = require('../../config')
const fs = require('fs')

const weekAry = [
  '周日',
  '周一',
  '周二',
  '周三',
  '周四',
  '周五',
  '周六',
]

export interface TaskObj {
  content: string,
  finish?: boolean,
  isPrivate: boolean,
  conf?: {
    link: string,
    remark: string,
    command: string,
  },
}

export default class Task {
  // 属性
  date: Date; // 待办时间点

  constructor(date: Date) {
    const {
      PRE_FILE_NAME,
      DATA_FILE_NAME,
    } = config

    this.date = date;
  }
  // 将待办数据文件转换为js对象
  translateFile(path: string): Promise<TaskObj[]> {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(path)) {
        // 文件存在，进行转译
        fs.readFile(path, 'utf8', (err, data) => {
          if (err) {
            logger.error(err)
            return reject(err)
          } else {
            if (typeof data === 'string') {
              resolve(JSON.parse(data))
            }
            resolve(data)
          }
        })
      } else {
        // 文件不存在，返回空值
        return reject(new Error(`file[${path}] is not exist`))
      }
    })
  }
  // 格式化待办列表
  formatList(list: TaskObj[], reverse = true) {
    let res = ''
    const mList = reverse ? list.reverse() : list
    for(let i = 0; i < mList.length; i += 1) {
      const id = reverse ? numToStr2(mList.length - i - 1): numToStr2(i)
      const { content, finish, isPrivate, conf } = mList[i]
      const { link, remark, command } = conf
      const template =
      `\n${id} - [${finish ? '√' : ' '}] ${content} ` +
      `${link ? `[${link}]` : ''}` +
      `${remark ? `[${remark}]` : ''}` +
      `${isPrivate ? `[${echoStyle('blue', '私')}]` : ''}` +
      `${command ? `[${command}]` : ''}`
      if (finish) {
        res += echoStyle('grey', template)
      } else {
        res += template
      }
    }
    return res
  }
  // 格式化日期标题头
  formatDateTitle(date: Date) {
    const moment = require('moment')
    const res = moment(date).format('YYYY.MM.DD')
    const wd = moment(date).format('d')
    if (res) {
      return `${res} - ${weekAry[wd]}`
    } else {
      logger.error(`${date} is not a date`)
      return null
    }
  }
  // 格式化日报
  formatRIBAO(list: TaskObj[]) {
    let res = '今日所做事项'
    for(let i = 0; i < list.length; i += 1) {
      const id = i + 1
      const { finish, content, conf } = list[i]
      const { link, command } = conf
      res += `\n${id}.${content}`
    }
    return res
  }
}