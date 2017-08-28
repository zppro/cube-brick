'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Created by zppro on 17-8-1.
 */

exports.default = (whitelist, { headers, methods, ignorePaths, logger }) => {
  const re = /http(s)?:\/\/192\.168\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]):?[0-9]*/gi; //内网地址
  const defaultHeaders = ['Content-Type', 'Content-Length', 'Authorization', 'Accept', 'X-Requested-With', 'Origin', 'Access-Control-Allow-Origin', 'X-Custom-TS'];
  const defaultMethods = ['PUT', 'POST', 'GET', 'DELETE', 'OPTIONS'];
  return async (ctx, next) => {
    const { url, method } = ctx;
    const isIgnore = ignorePaths && ignorePaths.find(o => url.startsWith(o));
    console.log('isIgnore:', isIgnore);
    if (!isIgnore) {
      const origin = (ctx.request.headers['origin'] || '').toLowerCase();
      let patched = whitelist.includes(origin) || origin.match(re);
      if (patched) {
        logger && logger.d(`patched CORS for path ${method}: ${url}`);
        console.log('allow Headers:', [...defaultHeaders, ...headers].join());
        console.log('allow Methods:', (methods || defaultMethods).join());
        ctx.set('Access-Control-Allow-Origin', origin);
        ctx.set('Access-Control-Allow-Credentials', 'true');
        ctx.set('Access-Control-Allow-Headers', [...defaultHeaders, ...headers].join());
        ctx.set('Access-Control-Allow-Methods', (methods || defaultMethods).join());
      } else {
        logger && logger.d(`not allow CORS for path ${method}: ${url}`);
        // ctx.set('Access-Control-Allow-Origin', origin);
        // ctx.set('Access-Control-Allow-Credentials', 'true');
        // ctx.set('Access-Control-Allow-Headers', 'Content-Type,Content-Length,Authorization,Accept,X-Requested-With,Origin,Access-Control-Allow-Origin,X-Custom-TS');
        // ctx.set('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
      }
    } else {
      logger && logger.d(`ignore CORS for path ${url}`);
      ctx.set('Access-Control-Allow-Origin', origin);
      ctx.set('Access-Control-Allow-Credentials', 'true');
      ctx.set('Access-Control-Allow-Headers', [...defaultHeaders, ...headers].join());
      ctx.set('Access-Control-Allow-Methods', (methods || defaultMethods).join());
    }
    await next();
  };
};