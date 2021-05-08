// require加载方式：
// 1、绝对路径 require('/xx/xx/index.js')
// 2、相对路径 require('./xx/index.js')
// 3、内置模块 require('fs')
// 命令形式运行：node -e require('../xx')

function init (name, options, command) {
  console.log('init');
  console.log('command', command)
  const parentcmd = command.parent
  //console.log('parentcmd', parentcmd)
}

module.exports = init