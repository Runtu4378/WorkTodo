import logger from '../utils/logger'

export default class Todo {
  // 属性
  date: Date; // 时间

  taskAhead: Object[]; // 前置待办
  taskList: Object[]; // 待办列表

  archiveList: Object[]; // 存档列表

  // 构造函数
  constructor() {}

  // 方法
  // 检查今天存档状态
  archiveCheckToday () {}
}