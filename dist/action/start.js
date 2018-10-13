"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("../utils/logger");
var archive_1 = require("../obj/archive");
module.exports = function () {
    // 检查今天是否已开启存档
    var today = new Date();
    logger_1.default.info("today is " + today);
    logger_1.default.info('init archive object');
    var archive = new archive_1.default(today);
    // 创建存档，读取默认待办
    // 读取昨天新增待办
    // 生成存档
    // 显示结果信息
    archive.createArchive()
        .catch(function (e) {
        // 全局的错误处理
        logger_1.default.error(e.message);
        process.exit(1);
    });
};
//# sourceMappingURL=start.js.map