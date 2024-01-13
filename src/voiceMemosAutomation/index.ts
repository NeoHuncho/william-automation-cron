import dotenv from 'dotenv';
import { projectRoot } from '../common/utils/getDirname.js';
import { getUnprocessedNextCloudRecordings } from './nextCloud.js';
dotenv.config({ path: projectRoot + '/.env' });

const index = async () => {
  await getUnprocessedNextCloudRecordings();
};
index();
