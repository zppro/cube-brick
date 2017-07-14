'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('./utils');

const combinedLogger = {
    d: (logger, ...args) => {
        let is_logger_is_log4js = logger && (0, _utils.isFunction)(logger.debug);
        if (!(0, _utils.isProduction)()) {
            if (!is_logger_is_log4js) {
                args.unshift(logger);
            }
            console.log.apply(null, args);
        }
        is_logger_is_log4js && logger.debug.apply(logger, args);
    },
    e: (logger, ...args) => {
        let is_logger_is_log4js = logger && (0, _utils.isFunction)(logger.error);
        if (!(0, _utils.isProduction)()) {
            if (!is_logger_is_log4js) {
                args.unshift(logger);
            }
            console.log.apply(null, args);
        }
        is_logger_is_log4js && logger.error.apply(logger, args);
    }
}; /**
    * Created by zppro on 17-7-12.
    */
exports.default = combinedLogger;