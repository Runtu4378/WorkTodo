var path = require('path');
var MODULE_NAME = 'todo';
var START = 'kaigong';
var ADD = 'add';
var SET = 'set';
var FIN = 'fin';
var DEL = 'del';
var LIST = 'list';
var END = 'shougong';
var RIBAO = 'ribao';
var PATH_ROOT = path.resolve(__dirname, '../');
var DEFAULT_DATA_PATH = path.resolve(PATH_ROOT, 'data/default.js');
var PRE_FILE_NAME = 'pre.json';
var DATA_FILE_NAME = 'data.json';
var DIR_FORMAT = 'YYYYMMDD';
module.exports = {
    MODULE_NAME: MODULE_NAME,
    START: START,
    ADD: ADD,
    SET: SET,
    FIN: FIN,
    DEL: DEL,
    LIST: LIST,
    END: END,
    RIBAO: RIBAO,
    PATH_ROOT: PATH_ROOT,
    DEFAULT_DATA_PATH: DEFAULT_DATA_PATH,
    PRE_FILE_NAME: PRE_FILE_NAME,
    DATA_FILE_NAME: DATA_FILE_NAME,
    DIR_FORMAT: DIR_FORMAT,
};
//# sourceMappingURL=config.js.map