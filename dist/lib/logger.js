'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('./utils');

var logger = {
    log: function log(logger) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        !(0, _utils.isProduction)() && console.log.apply(null, args);
        logger && logger.debug.apply(logger, args);
    },
    error: function error(logger) {
        for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
        }

        !(0, _utils.isProduction)() && console.log.apply(null, args);
        logger && logger.error.apply(logger, args);
    }
}; /**
    * Created by zppro on 17-7-12.
    */
exports.default = logger;