#!/usr/bin/env node

/*
  work_todo
*/
const yargs = require('yargs')

// init usage
yargs.usage(
  `todo ${require('../package.json').version}

  Usage: todo [command] [options]`
)

// init yargs command
require('./command-yargs')(yargs)

/* eslint-disable */
yargs
  .help('h')
  .alias('h', 'help')
  .version(require('../package.json').version)
  .alias('version', 'v')
  .showHelpOnFail()
  .strict()
  .argv;
