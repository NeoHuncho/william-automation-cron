import dotenv from 'dotenv';
import { projectRoot } from '../../common/utils/getDirname.js';
import { processRecordings } from '../index.js';
dotenv.config({ path: projectRoot + '/.env' });
const runIndexOnce = async () => {
  // Enable verbose logging for this one-off run
  process.env.VERBOSE_RUN_ONCE = 'true';
  await processRecordings();

  // logger.warn('🚨Unhandled error ocurred🚨 :', {
  //   errorName: 'error.name',
  //   errorMessage: 'error.message',
  //   errorStack: 'error.stack',
  // });
};

runIndexOnce();
