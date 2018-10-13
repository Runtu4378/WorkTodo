"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("../../utils/logger");
var func_1 = require("../../utils/func");
var config = require('../../config');
var fs = require('fs');
var weekAry = [
    '周日',
    '周一',
    '周二',
    '周三',
    '周四',
    '周五',
    '周六',
];
var Task = /** @class */ (function () {
    function Task(date) {
        var PRE_FILE_NAME = config.PRE_FILE_NAME, DATA_FILE_NAME = config.DATA_FILE_NAME;
        this.date = date;
    }
    // 将待办数据文件转换为js对象
    Task.prototype.translateFile = function (path) {
        return new Promise(function (resolve, reject) {
            if (fs.existsSync(path)) {
                // 文件存在，进行转译
                fs.readFile(path, 'utf8', function (err, data) {
                    if (err) {
                        logger_1.default.error(err);
                        return reject(err);
                    }
                    else {
                        if (typeof data === 'string') {
                            resolve(JSON.parse(data));
                        }
                        resolve(data);
                    }
                });
            }
            else {
                // 文件不存在，返回空值
                return reject(new Error("file[" + path + "] is not exist"));
            }
        });
    };
    // 格式化待办列表
    Task.prototype.formatList = function (list, reverse) {
        if (reverse === void 0) { reverse = true; }
        var res = '';
        var mList = reverse ? list.reverse() : list;
        for (var i = 0; i < mList.length; i += 1) {
            var id = reverse ? func_1.numToStr2(mList.length - i - 1) : func_1.numToStr2(i);
            var _a = mList[i], content = _a.content, finish = _a.finish, isPrivate = _a.isPrivate, conf = _a.conf;
            var link = conf.link, remark = conf.remark, command = conf.command;
            var template = "\n" + id + " - [" + (finish ? '√' : ' ') + "] " + content + " " +
                ("" + (link ? "[" + link + "]" : '')) +
                ("" + (remark ? "[" + remark + "]" : '')) +
                ("" + (isPrivate ? "[" + func_1.echoStyle('blue', '私') + "]" : '')) +
                ("" + (command ? "[" + command + "]" : ''));
            if (finish) {
                res += func_1.echoStyle('grey', template);
            }
            else {
                res += template;
            }
        }
        return res;
    };
    // 格式化日期标题头
    Task.prototype.formatDateTitle = function (date) {
        var moment = require('moment');
        var res = moment(date).format('YYYY.MM.DD');
        var wd = moment(date).format('d');
        if (res) {
            return res + " - " + weekAry[wd];
        }
        else {
            logger_1.default.error(date + " is not a date");
            return null;
        }
    };
    // 格式化日报
    Task.prototype.formatRIBAO = function (list) {
        var res = '今日所做事项';
        for (var i = 0; i < list.length; i += 1) {
            var id = i + 1;
            var _a = list[i], finish = _a.finish, content = _a.content, conf = _a.conf;
            var link = conf.link, command = conf.command;
            res += "\n" + id + "." + content;
        }
        return res;
    };
    return Task;
}());
exports.default = Task;
//# sourceMappingURL=index.js.map