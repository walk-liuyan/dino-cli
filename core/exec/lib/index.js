'use strict';

const Package = require('@dino-cli-dev/package')
const log = require('@dino-cli-dev/log')

const SETTINGS = {
    exec: '@dino-cli-dev/exec',
    init: '@dino-cli-dev/init'
}

function exec() {
    const cmdObj = arguments[arguments.length - 1]
    const cmdName = cmdObj.name()
    const packageName = SETTINGS[cmdName]
    const paclageVersion = 'latest'
    let targetPath = process.env.CLI_TARGET_PATH
    const homePath = process.env.CLI_HOME_PATH

    log.verbose('targetPath', targetPath)
    log.verbose('homepath', homePath)


    if(!targetPath) {
        // 生成缓存路径
        targetPath = ''
    }

    const pkg = new Package({
        targetPath,
        packageName,
        paclageVersion
    })
    console.log(pkg.getRootFilePath())
    // 1、根据targetPath拿到modulePath

    // 2、将modulePath生成package(npm 模块)
    // 3、Package.getRootFile 获取入口文件
    // 4、Package.update / Package.install
}

module.exports = exec;
