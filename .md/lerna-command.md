lerna link
lerna exec -- rm -fr node_modules // 批量对每个包执相同的语句

lerna exec --scope 某个包名 -- rm -fr node_modules // 批量对某个包执行语句

lerna run test // 执行每个包下面的run 语句

lerna run --scope 某个包名 test // 批量对某个包执行语句

lerna boostrap // 重新安装依赖
lerna clean // 清空依赖

lerna version
lerna changed // 查看相比之前的变化