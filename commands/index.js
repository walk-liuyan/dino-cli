#!/usr/bin/env node

const commander = require('commander')
const pkg = require('../package.json')

// 使用的是commander作为单例
// const {program} = commander.program;

// 自己初始化commander实例
const program = new commander.Command();

program
.name(Object.keys(pkg.bin)[0])
.usage('<command> [options]')
.parse(process.argv) // 解析传入的参数
.version(pkg.version)
//注册全局的option
.option('-d, --debug', '是否开启debug模式', false) // commander 写命令和yargs的使用方式不同，option('-d --debug', '注释', bool默认是否开启)
.option('-e, --envName <envName>', '获取环境变量');

// program.opts() // 可获得所有注册的option
// console.log('opts', program.opts());



// command注入方式： 1、command api注册 2、addCommand()
// 1、command api注册
const clone = program.command('clone <source> [destination]'); //command('具体的命令 <option 必填项> 若传入 就是必传，[destination选填项] 非必填')
clone
.description('clone a repository')
.option('-f, --force', '是否强制clone')
.action((source, destination, options) => {
  console.log('do clone', source, destination, options)
})

// 2、addCommand()  注册子命令，相当于一棵树，一个脚手架里内嵌脚手架。相当于【分组】
// 新生成一个实例
const service = new commander.Command('service');
service
.command('start [port]')
.description('start service at some port')
.action((port) => {
  console.log('do service start', port)
});
service
.command('stop')
.description('stop service')
.action(() => {
  console.log('do service stop')
})
program.addCommand(service);


program
.command('install [name]', '安装 package', {
  // 变相去执行：dino-cli install [name], 用途：多个脚手架之间互调
  executableFile: 'dino-cli', // 可执行另一个脚手架上面的命令
  isDefault: true, // 默认执行命令
  hidden: true
})
.alias('i');

// arguments 监听所有的命令输入
// program
// .arguments('<cmd> [options]')
// .description('test command', {
//   cmd: 'command to run', // 对具体参数的描述
//   options: 'options for command'
// })
// .action((cmd, options) => {
//   console.log(cmd, options)
// });


// 第1种：常规help信息
// program.outputHelp()

// 第2种：自定义help信息
// program.helpInformation = function() {
//   return 'your diy help info'
// }

// 第3种：事件监听
// program.on('--help', () => {
//   console.log('hhhh')
// })

// program.on('option:debug', function() {
//   console.log('debug', program.debug)
//   if(program.debug) {
//     process.env.LOG_LEVEL = 'verbose'
//   }
// })

// 第4种：对未知命令监听
program.on('command:*', function(obj){
  console.log('未知的命令', obj)
  const availableCommands = program.commands.map(cmd => cmd.name())
  console.log('可用的命令', availableCommands)
})
