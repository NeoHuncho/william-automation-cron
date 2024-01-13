import dotenv from 'dotenv';
import { projectRoot } from '../common/utils/getDirname.js';
import { getUnprocessedNextCloudRecordings } from './nextCloud.js';

const index = async () => {
  console.log('dirname', projectRoot);
  dotenv.config({ path: projectRoot + '/.env' });
  await getUnprocessedNextCloudRecordings();
};
index();
