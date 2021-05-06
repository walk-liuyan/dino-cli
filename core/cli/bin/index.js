#! /usr/bin/env node

const importLocal = require('import-local')
const log = require('@dino-cli-dev/log')

// 本地运行
if(importLocal(__filename)) {
  // 如果是用了本地link的npm包，就会进入这个模块
  log.notice('cli', '正在使用 cli 本地版本')
} else {
  // 最终的代码文件
  const argv = process.argv.slice(2);
  require('../lib')(argv)
}