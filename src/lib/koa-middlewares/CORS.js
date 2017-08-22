/**
 * Created by zppro on 17-8-1.
 */

export default (whitelist, { ignorePaths, logger }) => {
  const re = /http(s)?:\/\/192\.168\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]):?[0-9]*/gi;//内网地址
  return async (ctx, next) => {
    const {url, method} = ctx
    const isIgnore = ignorePaths && ignorePaths.find(o => url.startsWith(o))
    if (!isIgnore) {
      const origin = (ctx.request.headers['origin'] || '').toLowerCase();
      let patched = whitelist.includes(origin) || origin.match(re);
      if (patched) {
        logger && logger.d(`patched CORS for path ${method}: ${url}`)
        ctx.set('Access-Control-Allow-Origin', origin);
        ctx.set('Access-Control-Allow-Credentials', 'true');
        ctx.set('Access-Control-Allow-Headers', 'Content-Type,Content-Length,Authorization,Accept,X-Requested-With,Origin,Access-Control-Allow-Origin,X-Custom-TS');
        ctx.set('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
      }
      else {
        logger && logger.d(`not allow CORS for path ${method}: ${url}`)
        // ctx.set('Access-Control-Allow-Origin', origin);
        // ctx.set('Access-Control-Allow-Credentials', 'true');
        // ctx.set('Access-Control-Allow-Headers', 'Content-Type,Content-Length,Authorization,Accept,X-Requested-With,Origin,Access-Control-Allow-Origin,X-Custom-TS');
        // ctx.set('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
      }
    } else {
      logger && logger.d(`ignore CORS for path ${url}`)
    }
    await next()
  }
}