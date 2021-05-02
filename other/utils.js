import pathExists from 'path-exists'

export function isExist(path) {
  return pathExists.sync(path)
}

export function isExist1(path) {
  return pathExists.sync(path)
}
