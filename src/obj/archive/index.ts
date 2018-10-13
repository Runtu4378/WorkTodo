import logger from '../../utils/logger'
import {
  numToStr2,
  echoStyle,
} from '../../utils/func'
import Task, { TaskObj } from '../task'

const moment = require('moment')
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const clipboardy = require('clipboardy')

const config = require('../../config')

interface Today {
  date: Date; // 今日时间
  dirName: string; // 今日存档文件夹名
  dirPath: string; // 今日存档文件夹路径
  dataPath: string; // 今日存档文件路径
  hadCreate: boolean; // 今日存档创建状态
  preTaskPath: string;  // 前置待办文件路径
}

// 添加内容到剪贴板
const addCopy = (str: string) => {
  return clipboardy.writeSync(str)
}

// 计算待办数
const countNofinTask = (list: Object[]): number => {
  let n = 0
  for(let i = 0; i < list.length; i += 1) {
    if (!list[i]['finish']) {
      n += 1
    }
  }
  return n
}

// 寻找id对应的任务
const matchTask = (id: string, list: Object[]) => {
  let res
  for (let i = 0; i < list.length; i += 1) {
    if (list[i]['id'] === id) {
      res = list[i]
      break
    }
  }
  return res
}

// 更新待办列表
const updateList = (id: number, obj: Object, list: TaskObj[]): TaskObj[] => {
  const newList = [].concat(list)
  newList[id] = obj
  return newList
}

// 剔除私有任务
const outIsPrivate = (list: TaskObj[]) => {
  return list.filter((obj) => {
    return !obj.isPrivate
  })
}

// 存档对象
export default class Archive {
  // 属性
  today: Today; // 今日相关属性
  todayTask: Task;  // 今日待办

  // 构造函数
  constructor(today: Date) {
    const {
      PATH_ROOT,
      DIR_FORMAT,
      PRE_FILE_NAME,
      DATA_FILE_NAME,
    } = config

    // 初始化变量
    const dirName = moment(today).format(DIR_FORMAT)
    const dirPath = path.resolve(PATH_ROOT, 'data', dirName)
    const prePath = path.resolve(dirPath, PRE_FILE_NAME)
    const dataPath = path.resolve(dirPath, DATA_FILE_NAME)

    // 初始化对象属性
    this.today = {
      date: today,
      dirName: dirName,
      dirPath: dirPath,
      dataPath: dataPath,
      hadCreate: false,
      preTaskPath: prePath,
    }
    this.todayTask = new Task(today)

    // 检查今天存档是否已创建
    this.checkArchive()
  }

  // 检查今天存档状态
  checkArchive() {
    // 如果今天的数据文件夹还没被创建 或者 只有今天的前置待办文件已经被创建的话 视为今天的存档未被创建
    if (!fs.existsSync(this.today.dirPath)) {
      // 今天数据文件夹未被创建
      logger.info(`the data dir of today[${this.today.dirPath}] is not been create -- today\'s archive is not been create`)
    } else if (fs.existsSync(this.today.preTaskPath) && !fs.existsSync(this.today.dataPath)) {
      // 今天数据文件夹已被创建且前置待办文件已被创建
      logger.info(`the data dir of today[${this.today.dirPath}] had not been create and pre-task file[${this.today.preTaskPath}] had been create -- today\'s archive is not been create`)
    } else if (fs.existsSync(this.today.dataPath)) {
      // 今天的数据文件已被创建
      logger.info(`the data dir of today[${this.today.dirPath}] had benn create -- today archive is already create`)
      this.today.hadCreate = true
    }
  }
  // 创建存档
  async createArchive() {
    // 先创建今天存档文件夹
    if (this.today.hadCreate) {
      // 数据文件夹已被创建
      logger.info('data dir had been create')
      // 显示今天任务
      this.showToday('你今天已创建存档、')
    } else {
      /// 数据文件夹未被创建
      mkdirp(this.today.dirPath, (err) => {
        if (err) {
          throw new Error(err)
        } else {
          logger.info(`create data dir[${this.today.dirPath}]`)
          this.createTaskFile()
        }
      })
    }
  }
  // 创建待办数据文件
  async createTaskFile() {
    const { DEFAULT_DATA_PATH } = config
    const taskDefault = require(DEFAULT_DATA_PATH)
    let result
    // 判断有无前置待办
    if (fs.existsSync(this.today.preTaskPath)) {
      // 有前置待办
      const data = await this.todayTask.translateFile(this.today.preTaskPath)
      // 合并默认待办
      result = taskDefault.concat(data)
    } else {
      result = taskDefault
    }
    // 保存待办文件
    this.saveArchive(result)
    const logTxt = this.todayTask.formatList(result)
    const dateTxt = this.todayTask.formatDateTitle(this.today.date)
    console.log(
    '开工喽，看看今天你有什么任务吧：\n' +
    `你今天有 ${countNofinTask(result)} 条待办\n\n` +

    `[${dateTxt}]` +
    `${logTxt}\n` +

    '\n搬砖快乐:)\n'
    )
  }
  // 保存存档文件
  saveArchive(result: Object[]) {
    // 保存待办文件
    const writeObj = fs.createWriteStream(
      this.today.dataPath,
      {
        defaultEncoding: 'utf8',
        autoClose: true,
      },
    )
    writeObj.write(JSON.stringify(result))
    writeObj.end()
    logger.info(`save archive file: ${this.today.dataPath}`)
    // 错误捕捉
    writeObj.on('error', (err) => {
      logger.error(`error in create archive file: ${this.today.dataPath}`)
      logger.error(err)
    })
  }
  // 获取今日存档
  async getTodayArchive(): Promise<TaskObj[]> {
    const res = await this.todayTask.translateFile(this.today.dataPath).catch(err => { throw err })
    return res
  }
  // 显示今天任务
  async showToday(title: string, list?: TaskObj[]) {
    const data = list || await this.getTodayArchive()
    const logTxt = this.todayTask.formatList(data)
    const dateTxt = this.todayTask.formatDateTitle(this.today.date)
    console.log(
      `[${title}今天还有 ${countNofinTask(data)} 条待办]\n\n` +
      `[${dateTxt}]` +
      `${logTxt}\n`
    )
  }
  // 新增待办
  async createTask(target: TaskObj) {
    logger.info('get new task:')
    logger.info(target)
    // 获取当前待办
    const taskList = await this.todayTask.translateFile(this.today.dataPath)
    // 限制总记录数不超过100
    if (taskList.length >= 99) {
      throw new Error('over the max len of the task\'s list')
    }
    // 新待办加入列表
    const newList = [].concat(taskList, [target])
    logger.info('new taskList:')
    logger.info(newList)
    // 保存存档文件
    this.saveArchive(newList)
    // 显示log输出
    this.showToday('添加成功，', newList)
  }
  // 更新待办
  async setTask(id: number, target: TaskObj) {
    const idStr = numToStr2(id)
    const idNum = parseInt(idStr, 10)
    // 检查待办是否存在
    logger.info('check if the task exist')
    const taskList = await this.todayTask.translateFile(this.today.dataPath)
    const targetTask = taskList[idNum]
    if (!targetTask) {
      await this.showToday('')
      throw new Error(`task ${idStr} is not exist`)
    }
    logger.info('set object:')
    logger.info(target)
    const newConf = { ...targetTask.conf, ...target.conf }
    const newObj = { ...targetTask, ...target, conf: newConf }
    // 更新待办列表
    const newList = updateList(idNum, newObj, taskList)
    // 更新待办文件
    this.saveArchive(newList)
    // 显示log输出
    this.showToday('更新成功，', newList)
  }
  // 完成待办
  async finishTask(id) {
    const idStr = numToStr2(id)
    const idNum = parseInt(idStr, 10)
    // 检查待办是否存在
    logger.info('check if the task exist')
    const taskList = await this.todayTask.translateFile(this.today.dataPath)
    const targetTask = taskList[idNum]
    if (!targetTask) {
      await this.showToday('')
      throw new Error(`task ${idStr} is not exist`)
    } else if (targetTask.finish) {
      // 任务已完成
      throw new Error(`task ${idStr} had been finished`)
    } else {
      targetTask.finish = true
      // 更新待办列表
      const newList = updateList(idNum, targetTask, taskList)
      // 更新待办文件
      this.saveArchive(newList)
      // 显示log输出
      this.showToday('标记成功，', newList)
    }
  }
  // 删除待办
  async delTask(id) {
    const idStr = numToStr2(id)
    const idNum = parseInt(idStr, 10)
    // 检查待办是否存在
    logger.info('check if the task exist')
    const taskList = await this.todayTask.translateFile(this.today.dataPath)
    const targetTask = taskList[idNum]
    if (!targetTask) {
      await this.showToday('')
      throw new Error(`task ${idStr} is not exist`)
    }
    // 更新列表
    const newList = [].concat(taskList)
    newList.splice(idNum, 1)
    // 更新待办文件
    this.saveArchive(newList)
    // 显示log输出
    this.showToday('删除成功，', newList)
  }
  // 显示日报
  async showRIBAO() {
    const list = await this.getTodayArchive()
    const logTxt = this.todayTask.formatRIBAO(
      outIsPrivate(list)
    )
    console.log(logTxt)
    console.log('\n正在复制...')
    await addCopy(logTxt)
    console.log('\n日报已复制到剪贴板')
  }
  // 收工
  async endWork() {
    const list = await this.getTodayArchive()
    // 剔除私有任务
    const noFinNum = countNofinTask(
      outIsPrivate(list)
    )
    if (noFinNum > 0) {
      console.log(echoStyle('yellow', `你还有 ${noFinNum} 条非私有待办未完成哦\n`))
      this.showToday('')
    } else {
      console.log('你已完成今天所有工作啦，写日报收工吧~')
      this.showRIBAO()
    }
  }
}