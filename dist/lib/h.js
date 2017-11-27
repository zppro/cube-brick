'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRemoteResourceBuffer = exports.getRemoteResourceFile = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _requestPromiseNative = require('request-promise-native');

var _requestPromiseNative2 = _interopRequireDefault(_requestPromiseNative);

var _responser = require('./responser');

var _responser2 = _interopRequireDefault(_responser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by zppro on 17-11-28.
 */

const getRemoteResourceFile = exports.getRemoteResourceFile = async (url, storeDir) => {
  try {
    if (!url) {
      return _responser2.default.error({ message: `空资源:${url}` });
    }
    let file = url.substr(url.lastIndexOf('/') + 1);
    let storePath = _path2.default.join(storeDir, file);
    await (0, _requestPromiseNative2.default)(url).pipe(_fs2.default.createWriteStream(`${storePath}`));
    return _responser2.default.ret(storePath);
  } catch (e) {
    console.log(e);
    return _responser2.default.error(e);
  }
};

const getRemoteResourceBuffer = exports.getRemoteResourceBuffer = async url => {
  try {
    if (!url) {
      return _responser2.default.error({ message: `空资源:${url}` });
    }
    let data = await (0, _requestPromiseNative2.default)(url);
    return new Buffer(data, "binary");
  } catch (e) {
    console.log(e);
    return _responser2.default.error(e);
  }
};