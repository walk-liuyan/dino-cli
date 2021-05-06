'use strict';
const pkgDir = require('pkg-dir').sync;

const { isObject } = require('@dino-cli-dev/utils')

class Package {
    constructor(options) {
        if(!options) {
            throw new Error('Package options 参数不能为空')
        }
        if(!isObject(options)) {
            throw new Error('Package options 必须是 Object')
        }

        const { targetPath, storePath, packageName, packageVersion } = options
        // package的路径
        this.targetPath = targetPath
        // package的存储路径：远程下载以后寸到本地
        this.storePath = storePath
        // package 的name
        this.packageName = packageName
        // package 版本
        this.packageVersion = packageVersion

    }

    // 判断当前package是否存在
    exsit() {

    }

    // 安装package
    install() {

    }

    // 更新package
    update() {

    }

    // 获取入口文件的路径
    getRootFilePath() {
        // 1、获取package.json所在目录（pkg-dir）
        const dir = pkgDir(this.targetPath)
        return dir;
        // 2、读取package.json (require)
        // 3、找到main/lib - path
        // 4、路径兼容（os & window）
    }


}
module.exports = Package;
