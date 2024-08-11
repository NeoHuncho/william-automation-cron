import dotenv from 'dotenv';
import cron from 'node-cron';
import { hasUnsolvedBreakingError, logger } from '../common/logger.js';
import { projectRoot } from '../common/utils/getDirname.js';
import { transcribeAudio } from './api/deepgram.js';
import {
  getUnprocessedNextCloudRecordings,
  moveProcessedFiles,
} from './api/nextCloud.js';
import { addPageToDatabase } from './api/notion.js';
import { aiParseVoiceMemo } from './api/openAi.js';
import { filterOutUnknownFileNamingTypes } from './utils/filterOutUnknownFileNamingTypes.js';
dotenv.config({ path: projectRoot + '/.env' });

export const processRecordings = async () => {
  try {
    if ((await hasUnsolvedBreakingError()) === true) return;

    const nonFilteredRecordings = await getUnprocessedNextCloudRecordings();
    const recordings = filterOutUnknownFileNamingTypes(nonFilteredRecordings);
    if (Object.keys(recordings).length === 0) return;
    const transcripts = await transcribeAudio(recordings);
    const markdownScripts = await aiParseVoiceMemo(transcripts);
    const processedTranscripts = await addPageToDatabase({
      recordings,
      scripts: markdownScripts,
    });
    await moveProcessedFiles(processedTranscripts);
  } catch (error) {
    logger.error('🚨Unhandled error ocurred🚨 :', {
      errorName: error.name,
      errorMessage: error.message,
      errorStack: error.stack,
    });
  }
};

// Schedule the processRecordings function to run every day at 4 AM
if (process.env.NODE_ENV === 'production') {
  cron.schedule('0 4 * * *', processRecordings);
}
