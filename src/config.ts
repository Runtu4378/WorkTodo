const path = require('path')

const MODULE_NAME = 'todo'
const START = 'kaigong'
const ADD = 'add'
const SET = 'set'
const FIN = 'fin'
const DEL = 'del'
const LIST = 'list'
const END = 'shougong'
const RIBAO = 'ribao'

const PATH_ROOT = path.resolve(__dirname, '../')
const DEFAULT_DATA_PATH = path.resolve(PATH_ROOT, 'data/default.js')

const PRE_FILE_NAME = 'pre.json'
const DATA_FILE_NAME = 'data.json'

const DIR_FORMAT = 'YYYYMMDD'

module.exports = {
  MODULE_NAME,
  START,
  ADD,
  SET,
  FIN,
  DEL,
  LIST,
  END,
  RIBAO,

  PATH_ROOT,
  DEFAULT_DATA_PATH,

  PRE_FILE_NAME,
  DATA_FILE_NAME,

  DIR_FORMAT,
}
