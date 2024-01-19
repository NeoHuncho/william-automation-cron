import dotenv from 'dotenv';
import { projectRoot } from '../common/utils/getDirname.js';
import { transcribeAudio } from './api/deepgram.js';
import { getUnprocessedNextCloudRecordings } from './api/nextCloud.js';
dotenv.config({ path: projectRoot + '/.env' });

const index = async () => {
  await getUnprocessedNextCloudRecordings();
  await transcribeAudio();
};
index();
