'use strict'
module.exports = core
let args = {}, config = {};
const userHome = require('user-home');
const path = require('path')
const colors = require('colors')
const semver = require('semver')
const pathExists = require('path-exists').sync
const log = require('@dino-cli-dev/log')
const commander = require('commander')
const init = require('@dino-cli-dev/init')
const exec = require('@dino-cli-dev/exec')

// require 先执行
const constant = require('./const')
const pkg = require('../package.json');
const program = new commander.Command()

async function core () {
    log.info('run core')
    try {
        // 先检查参数，明确日志模式
        // checkInputArgs()
        await prepare()
        registryCommand()
    } catch (e) {
        if (program.debug) {
            log.error(e.message)
        }
        if (process.env.LOG_LEVEL === 'verbose') {
            log.error(e.message)
        }
    }
}

function checkPkgVersion () {
    log.info('cli', pkg.version)
}
/*
* 检查命令入参
* 需要放在 require log 之前，要提前设置LOG LEVEL的级别, 后面的log包才好直接使用 process.env.LOG_LEVEL
*/
function checkInputArgs () {
    const minimist = require('minimist')
    args = minimist(process.argv.slice(2))
    checkArgs(args)
}

function checkArgs (args) {
    if (args.debug) {
        process.env.LOG_LEVEL = 'verbose'
    } else {
        process.env.LOG_LEVEL = 'info'
    }
    log.level = process.env.LOG_LEVEL
}

/*
* 检查node版本
*/
function checkNodeVersion () {
    const curNodeV = process.version
    const lowNodeV = constant.LOWEST_NODE_VERSION

    // semver
    if (!semver.gte(curNodeV, lowNodeV)) {
        throw new Error(colors.red(`you need to install more than ${lowNodeV} version Node.js`))
    }
}

/*
* 检查root账户
*/
function checkRoot () {
    log.info('当前登陆的uid', process.geteuid())
    // uid = 0 说明是root账户， uid =  501 是 当前用户
    // 用 ll 命令看当前文件所有者的用户名
    const rootCheck = require('root-check')
    // 使用 root-check 自动降级，当你输入sudo dino-cli-dev，返回501
    // 实现原理是：isRoot ? process.setuid(501) 改变UID & process.setgid(process.env.SUDO_GID)改变GID :
    rootCheck()
}

function checkUserHome () {
    const userHome = require('user-home');
    // userHome 实现原理：到process.env里面去拿数据返回
    // process.env
    // process.env.LOGNAME || process.env.USER || process.env.LNAME
    // process.env.userHome
    // process.platform = 'win32' || 'darwin' || 'lunix'

    // pathExists 实现原理：fs.accessSync(path)
    log.info('用户主目录', userHome)

    if (!userHome || !pathExists(userHome)) {
        throw new Error(colors.red('当前登陆用户主目录不存在'))
    }
}

/*
* 获取环境变量的对应的配置
* 1、获取本地env后，若有.env,就取其值作为 环境变量（dotenv可将配置放入环境变量）
* 2、若没有.env，就使用默认配置，然后生成路径
*/
function checkEnvConf () {
    const dotenv = require('dotenv')
    const dotEnvPath = path.resolve(userHome, '.env')
    // 读取环境变量：如果本地有.env 会读取本地.env里的内容
    if (pathExists(dotEnvPath)) {
        // 读取 .env 的 配置, dotenv 会将变量放入 环境变量process.env
        config = dotenv.config({
            path: dotEnvPath
        })
    }
    // 根据环境变量生成默认配置
    config = createDefaultConfig()
    log.verbose('环境变量：', process.env.CLI_HOME_PATH)
}

function createDefaultConfig () {
    const cliConfig = {
        home: userHome
    }
    if (process.env.CLI_HOME) {
        // path.join将里面的参数用 / 进行拼接，形成路径
        cliConfig.cliHomePath = path.join(userHome, process.env.CLI_HOME)
    } else {
        cliConfig.cliHomePath = path.join(userHome, constant.DEFUALT_CLI_CONFIG)
    }
    process.env.CLI_HOME_PATH = cliConfig.cliHomePath
}

/*
* 是否可更新
*/
async function checkUpdate () {
    // 1、获取当前版本号和模块名
    const curVersion = pkg.version;
    const npmName = pkg.name
    // 2、调用npm OpenApi，获取所有版本号
    const { getNpmSemverVersion } = require('@dino-cli-dev/get-npm-info')
    const latestVersion = await getNpmSemverVersion(curVersion, npmName)
    // 3、提取所有版本号，比对哪些版本号是大于当前版本号
    // 4、提示安装最新的版本号
    if (latestVersion && semver.gt(latestVersion, curVersion)) {
        log.warn(colors.yellow(`please update ${npmName}, current version is ${curVersion}, latest version is ${latestVersion}
update command： npm install -g ${npmName}`))
    }

}

// 命令注册
function registryCommand () {
    program
        .name(Object.keys(pkg.bin)[0])
        .usage('<command> [options]')
        .version(pkg.version)
        .option('-d, --debug', '是否开启debug', false)
        .option('-tp, --targetPath <targetPath>', '是否指定本地调试文件路径', '');

    program.on('option:debug', function () {
        const opts = program.opts()
        if (opts.debug) {
            process.env.LOG_LEVEL = 'verbose'
        } else {
            process.env.LOG_LEVEL = 'info'
        }
        log.level = process.env.LOG_LEVEL
    })

    program.on('option:targetPath', function () {
        const opts = program.opts()
        process.env.CLI_TARGET_PATH = opts.targetPath
    })
    // program.addCommand();

    program
        .command('init [appName]')
        .option('-f, --force', '是否强制初始化')
        .action(init);

    program
        .command('exec [appName]')
        .option('-f, --force', '是否强制初始化')
        // exec() 中会传入command相关信息
        .action(exec);

    // process.argv 是终端命令的参数
    program.parse(process.argv);
}

// TODO： 动态加载命令后缓存，需要用到时在加载
// 通过node多进程 深挖cpu资源，


async function prepare () {
    checkPkgVersion();
    checkNodeVersion();
    checkRoot()
    checkUserHome()
    checkEnvConf()
    await checkUpdate()
}