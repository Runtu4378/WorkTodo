# workTodo

解决工作时待办事项管理的命令行小工具

[产品文档](/docs/design.md)

## 安装

```bash
npm i -g https://github.com/Runtu4378/workTodo
```

## 使用

```bash
todo <command> [options]
```

### 指令说明

- --version, -v: 显示模块版本
- --help, -h: 显示帮助文档
- --debug: 开启 debug 输出
- kaigong: 开启今天的工作存档
  -  --help: [显示帮助文档]
- add: 新增待办，传参为待办的内容
  - --help，-h: [显示帮助文档]
  - --link,-l: [待办相关的链接]
  - --time,-t: [待办相关的时间]
  - --remark,-r: [备注（不显示在日报中）]
  - --isPrivate,-p: [是否为私人事务（私人事务不显示在日报中，也不妨碍收工结算）]
- set: 更新待办，传参为待办的id
  - --content,-c: [要更新的内容]
  - --link,-l: [要更新的链接]
  - --time,-t: [要更新的时间]
  - --remark,-r: [要更新的备注]
  - --isPrivate,-p: [是否为私人事务]
  - --finish,-f: [完成状态，true 为已完成，默认为未完成]
- fin: 完成待办，传参为要完成的待办id
- del: 删除待办，传参为要删除的待办id
- list: 显示待办列表
- ribao: 显示并复制日报到剪贴板
- shougong: 收工并输出日报

> 具体使用流程为：
>
> `todo kaigong`: 开启本日待办存档 -> `todo add "comething"`: 增加一条待办 -> 其他操作待办的命令 -> `todo shougong`: 检查今天待办完成情况，并输出日报
>
> *更具体的使用情景请移步[产品文档](/docs/design.md)*

## 技术栈

- [typescript](https://www.tslang.cn/)[支持使用高级 js 语法和强类型的面向对象式编程]
- [yargs](https://github.com/yargs/yargs)[规范模块 CLI 传参的命令行格式化工具]
- [clipboardy](https://github.com/sindresorhus/clipboardy)[跨平台的剪贴板操作模块]
- [log4js](https://github.com/log4js-node/log4js-node)[支持日志静态化和多配置文件动态切换的日志实现]

## 待完成功能

* [ ] **新增明日待做**: `todo add` 增加一个参数 `-to` 为明日添加预定待做。
* [ ] **输出周报**: `todo zhoubao` 输出最近一个连续的记录周期的周报内容
