'use strict';
const path = require('path')
const pkgDir = require('pkg-dir').sync;
const pathExists = require('path-exists').sync
const { isObject } = require('@dino-cli-dev/utils')
const formatPath = require('@dino-cli-dev/format-path')
const npminstall = require('npminstall')
const { getDefaultRegistry, getNpmLatestVersion } = require('@dino-cli-dev/get-npm-info')

class Package {
    constructor(options) {
        if (!options) {
            throw new Error('Package options 参数不能为空')
        }
        if (!isObject(options)) {
            throw new Error('Package options 必须是 Object')
        }

        const { targetPath, storePath, storeDir, packageName, packageVersion } = options
        // package的路径
        this.targetPath = targetPath
        // package的存储路径：远程下载以后寸到本地
        this.storePath = storePath
        // 缓存package的路径
        this.storeDir = storeDir
        // package 的name
        this.packageName = packageName
        // package 版本
        this.packageVersion = packageVersion
        // package 的缓存目录前缀
        this.cacheFilePathPrefix = this.packageName.replace('/', '_')

    }
    async prepare () {

        if (this.packageVersion === 'latest') {
            this.packageVersion = await getNpmLatestVersion(this.packageName)
        }
        console.log(this.packageVersion)
    }

    // 判断当前package是否存在
    async exsits () {

        if (this.storeDir) {
            await this.prepare()
            console.log(this.cacheFilePath)
            return pathExists(this.cacheFilePath)
        } else {
            return pathExists(this.targetPath)
        }
    }

    get cacheFilePath () {
        return path.resolve(this.storeDir, `_${this.cacheFilePathPrefix}@${this.packageVersion}@${this.packageName}`)
    }

    // 安装package
    async install () {
        await this.prepare()
        return npminstall({
            root: this.targetPath,
            storeDir: this.storeDir,
            registry: getDefaultRegistry(),
            pkgs: [
                { name: this.packageName, version: this.packageVersion }
            ]
        })
    }

    // 更新package
    update () {

    }

    // 获取入口文件的路径
    getRootFilePath () {
        // 1、获取package.json所在目录（pkg-dir）
        const dir = pkgDir(this.targetPath)
        if (dir) {
            // 2、读取package.json (require)
            const pkgFile = require(path.resolve(dir, 'package.json'))
            if (pkgFile && (pkgFile.main || pkgFile.lib)) {
                // 不同OS对路径的兼容（mac os/window 对路径的显示不同，mac是：/，window是：\）
                // 返回 npm包-package.json 中mian指向的文件路径
                const filePath = formatPath(path.resolve(dir, pkgFile.main))
                console.log('filePath', filePath)
                return filePath;
            }
            return null
            // 3、找到main/lib - path
            // 4、路径兼容（os & window）
        }

    }


}
module.exports = Package;
