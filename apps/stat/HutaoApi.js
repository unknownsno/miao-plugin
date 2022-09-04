/*
* 胡桃API Miao-Plugin 封装
* https://github.com/DGP-Studio/DGP.Genshin.HutaoAPI
*
* */

import fetch from 'node-fetch'
import { Data } from '../../components/index.js'

const host = 'http://49.232.91.210:88/miaoPlugin/hutaoApi'

function getApi (api) {
  return `${host}?api=${api}`
}

let HutaoApi = {
  async req (url, param = {}) {
    let cacheData = await Data.getCacheJSON(`hutao:${url}`)
    if (cacheData && param.method !== 'POST') {
      return cacheData
    }

    let response = await fetch(getApi(`${url}`), {
      ...param,
      method: param.method || 'GET'
    })
    let retData = await response.json()
    if (retData && retData.data && param.method !== 'POST') {
      let d = new Date()
      retData.lastUpdate = `${d.toLocaleDateString()} ${d.toTimeString().substr(0, 5)}`
      await Data.setCacheJSON(`hutao:${url}`, retData, 3600)
    }
    return retData
  },

  // 角色持有及命座分布
  async getCons () {
    return await HutaoApi.req('/Statistics/Constellation')
  },

  async getAbyssPct () {
    return await HutaoApi.req('/Statistics/AvatarParticipation')
  },

  async getAbyssUse () {
    return await HutaoApi.req('/Statistics2/AvatarParticipation')
  },

  async getAbyssTeam () {
    return await HutaoApi.req('/Statistics/TeamCombination')
  },

  async getOverview () {
    return await HutaoApi.req('/Statistics/Overview')
  },

  async upload (data) {
    let body = JSON.stringify(data)
    return await HutaoApi.req('/Record/Upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/json; charset=utf-8'
      },
      body
    })
  },

  async uploadData (data = {}) {
    let body = JSON.stringify(data)
    return await HutaoApi.req('/Record/UploadData', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/json; charset=utf-8'
      },
      body
    })
  }
}

export default HutaoApi