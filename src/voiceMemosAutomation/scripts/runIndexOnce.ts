import dotenv from 'dotenv';
import { logger } from '../../common/logger.js';
import { projectRoot } from '../../common/utils/getDirname.js';
import { processRecordings } from '../index.js';
dotenv.config({ path: projectRoot + '/.env' });
const runIndexOnce = async () => {
  await processRecordings();

  // logger.warn('🚨Unhandled error ocurred🚨 :', {
  //   errorName: 'error.name',
  //   errorMessage: 'error.message',
  //   errorStack: 'error.stack',
  // });
};

runIndexOnce();
