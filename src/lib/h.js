/**
 * Created by zppro on 17-11-28.
 */

import fs from 'fs'
import path from 'path'
import rp from 'request-promise-native'
import responser from './responser'

export const getRemoteResourceFile = async (url, storeDir) => {
  try {
    if(!url){
      return responser.error({message: `空资源:${url}` })
    }
    let file = url.substr(url.lastIndexOf('/') + 1)
    let storePath = path.join(storeDir, file)
    await rp(url).pipe(fs.createWriteStream(`${storePath}`))
    return responser.ret(storePath)
  }
  catch (e) {
    console.log(e)
    return responser.error(e);
  }
}

export const getRemoteResourceBuffer = async (url) => {
  try {
    if (!url) {
      return responser.error({message: `空资源:${url}`})
    }
    let data = await rp(url);
    return new Buffer(data, "binary")
  }
  catch (e) {
    console.log(e)
    return responser.error(e);
  }
}