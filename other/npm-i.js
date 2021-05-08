const npminstall = require('npminstall')
const path = require('path')
const userHome = require('user-home')

npminstall({
  // 需要安装的路径
  root: path.resolve(userHome, '.dino-cli-dev'),
  // 依赖安装路径
  storeDir: path.resolve(userHome, '.dino-cli-dev', 'node_modules'),
  registry: 'https://registry.npmjs.org',
  pkgs: [
    {
      name: 'react', versions: '^16.7.0'
    }
  ]
})