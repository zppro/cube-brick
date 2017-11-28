/**
 * Created by zppro on 17-11-28.
 */

import fs from 'fs'
import path from 'path'
import rp from 'request-promise-native'
import responser from './responser'
import { thunk2Promise } from  './utils'

export const _getRemoteResourceFile = (url, storeDir, callback) => {
  try {
    if(!url){
      return responser.error({message: `空资源:${url}` })
    }
    let file = url.substr(url.lastIndexOf('/') + 1)
    let storePath = path.join(storeDir, file)

    let writer = rp(url).pipe(fs.createWriteStream(`${storePath}`))
    writer.on('finish', () => {
      callback(null, responser.ret(storePath))
    });
    writer.on('error', (err) => {
      callback(err, null)
    });
  }
  catch (e) {
    console.log(e)
    return responser.error(e);
  }
}

export const getRemoteResourceFile = thunk2Promise(_getRemoteResourceFile)

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