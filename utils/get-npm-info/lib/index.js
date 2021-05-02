'use strict';
const CNPM = 'http://registry.npm.taobao.org/'
const NPM = 'http://registry.npmjs.org/'

const axios = require('axios')
const urlJoin = require('url-join')
const semver = require('semver')

async function getNpmInfo(npmName, _registry) {
    if(!npmName) return null
    const registry = _registry || getDefaultRegistry()
    const npmInfoUrl = urlJoin(registry, npmName)
    return axios.get(npmInfoUrl).then((res) => {
      const { status, data } = res;
      if(status === 200) {
        return data;
      }
      return null
    }).catch(err => {
      return Promise.reject(err)
    })
}

function getDefaultRegistry(isOriginal = true) {
  return isOriginal ? NPM : CNPM;
 }

 async function getNpmVersions(npmName, _registry) {
   const npmInfo = await getNpmInfo(npmName, _registry)
   if(npmInfo) {
     return Object.keys(npmInfo.versions)
   } else {
     return []
   }
  }

  function getSemverVersions(baseVersion, versions) {
    versions = versions
    .filter(v => {
      // 满足 > 当前条件
      return semver.satisfies(v, `^${baseVersion}`)
    })
    versions.sort((a, b) => semver.gt(b,a))
    return versions;
   }

 async function getNpmSemverVersion(baseVersion, npmName, _registry) {
  const versins = await getNpmVersions(npmName, getDefaultRegistry())
  const newVersions = getSemverVersions(baseVersion, versins)
  if(newVersions && newVersions.length > 0) {
    return newVersions[0]
}
return null
 }

module.exports = {
  getNpmInfo,
  getNpmVersions,
  getNpmSemverVersion
}