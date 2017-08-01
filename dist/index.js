'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.responser = exports.mongoManager = exports.mongoFactory = exports.logger = exports.jobManager = exports.dicBuilder = exports.koaCORS = undefined;

var _CORS = require('./lib/koa-middlewares/CORS');

var _CORS2 = _interopRequireDefault(_CORS);

var _dictBuilder = require('./lib/dict-builder');

var _dictBuilder2 = _interopRequireDefault(_dictBuilder);

var _jobManager = require('./lib/job-manager');

var _jobManager2 = _interopRequireDefault(_jobManager);

var _logger = require('./lib/logger');

var _logger2 = _interopRequireDefault(_logger);

var _mongoFactory = require('./lib/mongo-factory');

var _mongoFactory2 = _interopRequireDefault(_mongoFactory);

var _responser = require('./lib/responser');

var _responser2 = _interopRequireDefault(_responser);

var _utils = require('./lib/utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// export const dicBuilder = dicBuilder;
// export const jobManager = jobManager;
// export const logger = logger;
exports.koaCORS = _CORS2.default;
exports.dicBuilder = _dictBuilder2.default;
exports.jobManager = _jobManager2.default;
exports.logger = _logger2.default;
exports.mongoFactory = _mongoFactory2.default;
exports.mongoManager = _mongoFactory.DBManager;
exports.responser = _responser2.default; /**
                                          * Created by zppro on 17-7-12.
                                          */

exports.default = utils;