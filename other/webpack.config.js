const path = require('path')
// __dirname 当前文件夹的绝对路径
module.exports = {
  entry: './nodeUseESModule.js',
  output: {
    filename: 'index.js',
    path: path.join(__dirname, '/dist')
  },
  mode: 'development',
  target: 'node', // 默认是web，是没有path、fs这些node内置库的。若是node 就认识了
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules|dist)/,
      use: {
        // 低版本node也可跑 进行编译
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: [
            [
              '@babel/plugin-transform-runtime',
              // 参数
               {
                corejs: 3,
                regenerator: true,
                useESModules: true,
                helpers: true
              }
            ]
          ]
        }
      }
    }]
  }
}
