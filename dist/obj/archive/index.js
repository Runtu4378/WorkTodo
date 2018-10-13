"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("../../utils/logger");
var func_1 = require("../../utils/func");
var task_1 = require("../task");
var moment = require('moment');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var clipboardy = require('clipboardy');
var config = require('../../config');
// 添加内容到剪贴板
var addCopy = function (str) {
    return clipboardy.writeSync(str);
};
// 计算待办数
var countNofinTask = function (list) {
    var n = 0;
    for (var i = 0; i < list.length; i += 1) {
        if (!list[i]['finish']) {
            n += 1;
        }
    }
    return n;
};
// 寻找id对应的任务
var matchTask = function (id, list) {
    var res;
    for (var i = 0; i < list.length; i += 1) {
        if (list[i]['id'] === id) {
            res = list[i];
            break;
        }
    }
    return res;
};
// 更新待办列表
var updateList = function (id, obj, list) {
    var newList = [].concat(list);
    newList[id] = obj;
    return newList;
};
// 剔除私有任务
var outIsPrivate = function (list) {
    return list.filter(function (obj) {
        return !obj.isPrivate;
    });
};
// 存档对象
var Archive = /** @class */ (function () {
    // 构造函数
    function Archive(today) {
        var PATH_ROOT = config.PATH_ROOT, DIR_FORMAT = config.DIR_FORMAT, PRE_FILE_NAME = config.PRE_FILE_NAME, DATA_FILE_NAME = config.DATA_FILE_NAME;
        // 初始化变量
        var dirName = moment(today).format(DIR_FORMAT);
        var dirPath = path.resolve(PATH_ROOT, 'data', dirName);
        var prePath = path.resolve(dirPath, PRE_FILE_NAME);
        var dataPath = path.resolve(dirPath, DATA_FILE_NAME);
        // 初始化对象属性
        this.today = {
            date: today,
            dirName: dirName,
            dirPath: dirPath,
            dataPath: dataPath,
            hadCreate: false,
            preTaskPath: prePath,
        };
        this.todayTask = new task_1.default(today);
        // 检查今天存档是否已创建
        this.checkArchive();
    }
    // 检查今天存档状态
    Archive.prototype.checkArchive = function () {
        // 如果今天的数据文件夹还没被创建 或者 只有今天的前置待办文件已经被创建的话 视为今天的存档未被创建
        if (!fs.existsSync(this.today.dirPath)) {
            // 今天数据文件夹未被创建
            logger_1.default.info("the data dir of today[" + this.today.dirPath + "] is not been create -- today's archive is not been create");
        }
        else if (fs.existsSync(this.today.preTaskPath) && !fs.existsSync(this.today.dataPath)) {
            // 今天数据文件夹已被创建且前置待办文件已被创建
            logger_1.default.info("the data dir of today[" + this.today.dirPath + "] had not been create and pre-task file[" + this.today.preTaskPath + "] had been create -- today's archive is not been create");
        }
        else if (fs.existsSync(this.today.dataPath)) {
            // 今天的数据文件已被创建
            logger_1.default.info("the data dir of today[" + this.today.dirPath + "] had benn create -- today archive is already create");
            this.today.hadCreate = true;
        }
    };
    // 创建存档
    Archive.prototype.createArchive = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                // 先创建今天存档文件夹
                if (this.today.hadCreate) {
                    // 数据文件夹已被创建
                    logger_1.default.info('data dir had been create');
                    // 显示今天任务
                    this.showToday('你今天已创建存档、');
                }
                else {
                    /// 数据文件夹未被创建
                    mkdirp(this.today.dirPath, function (err) {
                        if (err) {
                            throw new Error(err);
                        }
                        else {
                            logger_1.default.info("create data dir[" + _this.today.dirPath + "]");
                            _this.createTaskFile();
                        }
                    });
                }
                return [2 /*return*/];
            });
        });
    };
    // 创建待办数据文件
    Archive.prototype.createTaskFile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var DEFAULT_DATA_PATH, taskDefault, result, data, logTxt, dateTxt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        DEFAULT_DATA_PATH = config.DEFAULT_DATA_PATH;
                        taskDefault = require(DEFAULT_DATA_PATH);
                        if (!fs.existsSync(this.today.preTaskPath)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.todayTask.translateFile(this.today.preTaskPath)
                            // 合并默认待办
                        ];
                    case 1:
                        data = _a.sent();
                        // 合并默认待办
                        result = taskDefault.concat(data);
                        return [3 /*break*/, 3];
                    case 2:
                        result = taskDefault;
                        _a.label = 3;
                    case 3:
                        // 保存待办文件
                        this.saveArchive(result);
                        logTxt = this.todayTask.formatList(result);
                        dateTxt = this.todayTask.formatDateTitle(this.today.date);
                        console.log('开工喽，看看今天你有什么任务吧：\n' +
                            ("\u4F60\u4ECA\u5929\u6709 " + countNofinTask(result) + " \u6761\u5F85\u529E\n\n") +
                            ("[" + dateTxt + "]") +
                            (logTxt + "\n") +
                            '\n搬砖快乐:)\n');
                        return [2 /*return*/];
                }
            });
        });
    };
    // 保存存档文件
    Archive.prototype.saveArchive = function (result) {
        var _this = this;
        // 保存待办文件
        var writeObj = fs.createWriteStream(this.today.dataPath, {
            defaultEncoding: 'utf8',
            autoClose: true,
        });
        writeObj.write(JSON.stringify(result));
        writeObj.end();
        logger_1.default.info("save archive file: " + this.today.dataPath);
        // 错误捕捉
        writeObj.on('error', function (err) {
            logger_1.default.error("error in create archive file: " + _this.today.dataPath);
            logger_1.default.error(err);
        });
    };
    // 获取今日存档
    Archive.prototype.getTodayArchive = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.todayTask.translateFile(this.today.dataPath).catch(function (err) { throw err; })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res];
                }
            });
        });
    };
    // 显示今天任务
    Archive.prototype.showToday = function (title, list) {
        return __awaiter(this, void 0, void 0, function () {
            var data, _a, logTxt, dateTxt;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = list;
                        if (_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getTodayArchive()];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        data = _a;
                        logTxt = this.todayTask.formatList(data);
                        dateTxt = this.todayTask.formatDateTitle(this.today.date);
                        console.log("[" + title + "\u4ECA\u5929\u8FD8\u6709 " + countNofinTask(data) + " \u6761\u5F85\u529E]\n\n" +
                            ("[" + dateTxt + "]") +
                            (logTxt + "\n"));
                        return [2 /*return*/];
                }
            });
        });
    };
    // 新增待办
    Archive.prototype.createTask = function (target) {
        return __awaiter(this, void 0, void 0, function () {
            var taskList, newList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger_1.default.info('get new task:');
                        logger_1.default.info(target);
                        return [4 /*yield*/, this.todayTask.translateFile(this.today.dataPath)
                            // 限制总记录数不超过100
                        ];
                    case 1:
                        taskList = _a.sent();
                        // 限制总记录数不超过100
                        if (taskList.length >= 99) {
                            throw new Error('over the max len of the task\'s list');
                        }
                        newList = [].concat(taskList, [target]);
                        logger_1.default.info('new taskList:');
                        logger_1.default.info(newList);
                        // 保存存档文件
                        this.saveArchive(newList);
                        // 显示log输出
                        this.showToday('添加成功，', newList);
                        return [2 /*return*/];
                }
            });
        });
    };
    // 更新待办
    Archive.prototype.setTask = function (id, target) {
        return __awaiter(this, void 0, void 0, function () {
            var idStr, idNum, taskList, targetTask, newConf, newObj, newList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        idStr = func_1.numToStr2(id);
                        idNum = parseInt(idStr, 10);
                        // 检查待办是否存在
                        logger_1.default.info('check if the task exist');
                        return [4 /*yield*/, this.todayTask.translateFile(this.today.dataPath)];
                    case 1:
                        taskList = _a.sent();
                        targetTask = taskList[idNum];
                        if (!!targetTask) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.showToday('')];
                    case 2:
                        _a.sent();
                        throw new Error("task " + idStr + " is not exist");
                    case 3:
                        logger_1.default.info('set object:');
                        logger_1.default.info(target);
                        newConf = __assign({}, targetTask.conf, target.conf);
                        newObj = __assign({}, targetTask, target, { conf: newConf });
                        newList = updateList(idNum, newObj, taskList);
                        // 更新待办文件
                        this.saveArchive(newList);
                        // 显示log输出
                        this.showToday('更新成功，', newList);
                        return [2 /*return*/];
                }
            });
        });
    };
    // 完成待办
    Archive.prototype.finishTask = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var idStr, idNum, taskList, targetTask, newList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        idStr = func_1.numToStr2(id);
                        idNum = parseInt(idStr, 10);
                        // 检查待办是否存在
                        logger_1.default.info('check if the task exist');
                        return [4 /*yield*/, this.todayTask.translateFile(this.today.dataPath)];
                    case 1:
                        taskList = _a.sent();
                        targetTask = taskList[idNum];
                        if (!!targetTask) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.showToday('')];
                    case 2:
                        _a.sent();
                        throw new Error("task " + idStr + " is not exist");
                    case 3:
                        if (targetTask.finish) {
                            // 任务已完成
                            throw new Error("task " + idStr + " had been finished");
                        }
                        else {
                            targetTask.finish = true;
                            newList = updateList(idNum, targetTask, taskList);
                            // 更新待办文件
                            this.saveArchive(newList);
                            // 显示log输出
                            this.showToday('标记成功，', newList);
                        }
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // 删除待办
    Archive.prototype.delTask = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var idStr, idNum, taskList, targetTask, newList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        idStr = func_1.numToStr2(id);
                        idNum = parseInt(idStr, 10);
                        // 检查待办是否存在
                        logger_1.default.info('check if the task exist');
                        return [4 /*yield*/, this.todayTask.translateFile(this.today.dataPath)];
                    case 1:
                        taskList = _a.sent();
                        targetTask = taskList[idNum];
                        if (!!targetTask) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.showToday('')];
                    case 2:
                        _a.sent();
                        throw new Error("task " + idStr + " is not exist");
                    case 3:
                        newList = [].concat(taskList);
                        newList.splice(idNum, 1);
                        // 更新待办文件
                        this.saveArchive(newList);
                        // 显示log输出
                        this.showToday('删除成功，', newList);
                        return [2 /*return*/];
                }
            });
        });
    };
    // 显示日报
    Archive.prototype.showRIBAO = function () {
        return __awaiter(this, void 0, void 0, function () {
            var list, logTxt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTodayArchive()];
                    case 1:
                        list = _a.sent();
                        logTxt = this.todayTask.formatRIBAO(outIsPrivate(list));
                        console.log(logTxt);
                        console.log('\n正在复制...');
                        return [4 /*yield*/, addCopy(logTxt)];
                    case 2:
                        _a.sent();
                        console.log('\n日报已复制到剪贴板');
                        return [2 /*return*/];
                }
            });
        });
    };
    // 收工
    Archive.prototype.endWork = function () {
        return __awaiter(this, void 0, void 0, function () {
            var list, noFinNum;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTodayArchive()
                        // 剔除私有任务
                    ];
                    case 1:
                        list = _a.sent();
                        noFinNum = countNofinTask(outIsPrivate(list));
                        if (noFinNum > 0) {
                            console.log(func_1.echoStyle('yellow', "\u4F60\u8FD8\u6709 " + noFinNum + " \u6761\u975E\u79C1\u6709\u5F85\u529E\u672A\u5B8C\u6210\u54E6\n"));
                            this.showToday('');
                        }
                        else {
                            console.log('你已完成今天所有工作啦，写日报收工吧~');
                            this.showRIBAO();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return Archive;
}());
exports.default = Archive;
//# sourceMappingURL=index.js.map