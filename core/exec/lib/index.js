'use strict';

const path = require('path')
const Package = require('@dino-cli-dev/package')
const log = require('@dino-cli-dev/log')

const SETTINGS = {
    exec: '@dino-cli-dev/exec',
    init: '@dino-cli-dev/init'
}
const CACHE_DIR = 'dependencies'

async function exec () {
    const cmdObj = arguments[arguments.length - 1]
    const cmdName = cmdObj.name()
    const packageName = SETTINGS[cmdName]
    const paclageVersion = 'latest'

    let storeDir = '';
    let pkg = {};
    let targetPath = process.env.CLI_TARGET_PATH
    const homePath = process.env.CLI_HOME_PATH

    log.verbose('targetPath', targetPath)
    log.verbose('homepath', homePath)


    if (!targetPath) {
        // 生成缓存路径
        targetPath = path.resolve(homePath, CACHE_DIR)
        storeDir = path.resolve(homePath, CACHE_DIR, 'node_modules')
        log.verbose('targetPath', targetPath)
        log.verbose('storeDir', storeDir)
        pkg = new Package({
            targetPath,
            storeDir,
            packageName,
            paclageVersion
        })
        console.log('getRootFilePath', pkg.getRootFilePath())
        if (await pkg.exsits()) {
            // 更新package
            console.log('更新package')

        } else {
            // 安装package
            await pkg.install()

        }
    } else {
        pkg = new Package({
            targetPath,
            storeDir,
            packageName,
            paclageVersion
        })
        console.log(await pkg.exsits())
        const rootFile = pkg.getRootFilePath()
        if (rootFile) {
            // arguments是数组
            require(rootFile).apply(null, arguments);// rootFile路径，如果返回fun，直接执行
        }
    }


    // 1、根据targetPath拿到modulePath

    // 2、将modulePath生成package(npm 模块)
    // 3、Package.getRootFile 获取入口文件
    // 4、Package.update / Package.install
}

module.exports = exec;
