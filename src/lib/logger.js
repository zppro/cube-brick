/**
 * Created by zppro on 17-7-12.
 */
import { isFunction, isProduction } from './utils'

const combinedLogger = {
    d: function (logger, ...args) {
        let is_logger_is_log4js = logger && isFunction(logger.debug);
        if(!isProduction()) {
            if (!is_logger_is_log4js) {
                args.unshift(logger)
            }
            console.log.apply(null, args);
        }
        is_logger_is_log4js && logger.debug.apply(logger, args);
    },
    e: function (logger, ...args) {
        let is_logger_is_log4js = logger && isFunction(logger.error);
        if(!isProduction()) {
            if (!is_logger_is_log4js) {
                args.unshift(logger)
            }
            console.log.apply(null, args);
        }
        is_logger_is_log4js && logger.error.apply(logger, args)
    }
}

export default combinedLogger;