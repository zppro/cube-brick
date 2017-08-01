/**
 * Created by zppro on 17-7-12.
 */
import koaCORS from './lib/koa-middlewares/CORS'
import dicBuilder from './lib/dict-builder';
import jobManager from './lib/job-manager';
import logger from './lib/logger';
import mongoFactory, { DBManager as mongoManager } from './lib/mongo-factory';
import responser from './lib/responser';
import * as utils from './lib/utils';

// export const dicBuilder = dicBuilder;
// export const jobManager = jobManager;
// export const logger = logger;
export {koaCORS, dicBuilder, jobManager, logger, mongoFactory, mongoManager, responser};
export default utils;


