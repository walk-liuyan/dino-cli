// Node 中支持 es module， node默认支持commonjs规范
// 方法一： 配置webpack，babel 配置编译：useESModules
// 方法二：node --experimental-modules **.mjs 或者是 版本升到v14，node **.mjs, 到14+之后默认支持esModule，但是文件类型需要是mjs

// 模块化： AMD CMD require.js
// CommonJS： 通过require加载模块，通过module.exports / exports.xx 暴露模块
// ES Module: 通过 import 加载模块, 暴露 export defaul / export function / export const

import path, { resolve } from 'path'
import { isExist } from './utils'
// node 中不认识import: SyntaxError: Cannot use import statement outside a module
console.log(isExist(path.resolve('.')))

(async function() {
  await new Promise((resolve) => {
    setTimeout(resolve, 1000)
    console.log('ok')
  })
})()

