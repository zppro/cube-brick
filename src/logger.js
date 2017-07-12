/**
 * Created by zppro on 17-7-12.
 */
import { isProduction } from './utils'

const logger = {
    log: function (logger, ...args) {
        !isProduction() && console.log.apply(null, args);
        logger && logger.debug.apply(logger, args);
    },
    error: function (logger, ...args) {
        !isProduction() && console.log.apply(null, args);
        logger && logger.error.apply(logger, args)
    }
}

export default logger;