/**
 * Created by zppro on 17-8-1.
 */

export default (koaRouter, { whitelist, headers, methods, ignorePaths, logger }) => {
  const re = /http(s)?:\/\/192\.168\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]):?[0-9]*/gi;//内网地址
  const defaultHeaders = ['Content-Type', 'Content-Length', 'Authorization', 'Accept', 'X-Requested-With', 'Origin', 'Access-Control-Allow-Origin', 'X-Custom-TS']
  const defaultMethods = ['PUT', 'POST', 'GET', 'DELETE', 'OPTIONS'] //, 'put', 'post', 'get', 'delete', 'options', 'put', 'Post', 'Get', 'Delete', 'Options'

  let allowHeaders = [...defaultHeaders, ...headers].join()
  let allowMethods = (methods || defaultMethods).join()
  console.log('allow Headers:', allowHeaders)
  console.log('allow Methods:', allowMethods)
  koaRouter && koaRouter.options('*', async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set('Access-Control-Allow-Credentials', 'true');
    ctx.set('Access-Control-Allow-Headers', allowHeaders);
    ctx.set('Access-Control-Allow-Methods', allowMethods);
    await next()
  })

  return async (ctx, next) => {
    const {url, method} = ctx
    const isIgnore = ignorePaths && ignorePaths.find(o => url.startsWith(o))
    console.log('isIgnore:', isIgnore)
    if (!isIgnore) {
      const origin = (ctx.request.headers['origin'] || '').toLowerCase();
      let patched = (whitelist && whitelist.includes(origin)) || origin.match(re);
      if (patched) {
        logger && logger.d(`patched CORS for path ${method}: ${url}`)

        ctx.set('Access-Control-Allow-Origin', origin);
        ctx.set('Access-Control-Allow-Credentials', 'true');
        ctx.set('Access-Control-Allow-Headers', allowHeaders);
        ctx.set('Access-Control-Allow-Methods', allowMethods);
      }
      else {
        logger && logger.d(`not allow CORS for path ${method}: ${url}`)
      }
    } else {
      logger && logger.d(`ignore CORS for path ${url}`)
      ctx.set('Access-Control-Allow-Origin', origin);
      ctx.set('Access-Control-Allow-Credentials', 'true');
      ctx.set('Access-Control-Allow-Headers', allowHeaders);
      ctx.set('Access-Control-Allow-Methods', allowMethods);
    }
    await next()
  }
}