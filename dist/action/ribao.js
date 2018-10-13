"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("../utils/logger");
var archive_1 = require("../obj/archive");
var config = require('../config');
var MODULE_NAME = config.MODULE_NAME, START = config.START;
module.exports = function (obj) {
    // 检查今天是否已创建存档
    var today = new Date();
    logger_1.default.info("today is " + today);
    logger_1.default.info('init archive object');
    var archive = new archive_1.default(today);
    if (!archive.today.hadCreate) {
        // 未创建存档
        logger_1.default.error("you need to create today archive first. run: " + MODULE_NAME + " " + START);
        process.exit(1);
    }
    else {
        // 已创建存档
        archive.showRIBAO()
            .catch(function (e) {
            // 全局的错误处理
            logger_1.default.error(e.message);
            process.exit(1);
        });
    }
};
//# sourceMappingURL=ribao.js.map