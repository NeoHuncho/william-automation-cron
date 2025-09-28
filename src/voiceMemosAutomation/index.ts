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
    logger.info('Starting processRecordings run');
    const nonFilteredRecordings = await getUnprocessedNextCloudRecordings();
    logger.info('Fetched recordings from NextCloud', {
      count: nonFilteredRecordings
        ? Object.keys(nonFilteredRecordings).length
        : 0,
    });
    const recordings = filterOutUnknownFileNamingTypes(nonFilteredRecordings);
    logger.info('Filtered recordings', {
      count: Object.keys(recordings).length,
    });
    if (Object.keys(recordings).length === 0) {
      logger.info('No recordings to process. Exiting.');
      return;
    }
    const transcripts = await transcribeAudio(recordings);
    logger.info('Transcription complete', {
      count: Object.keys(transcripts).length,
    });
    const markdownScripts = await aiParseVoiceMemo(transcripts);
    logger.info('AI parsing complete', {
      count: Object.keys(markdownScripts).length,
    });
    const processedTranscripts = await addPageToDatabase({
      recordings,
      scripts: markdownScripts,
    });
    logger.info('Pages added to Notion', {
      count: processedTranscripts.length,
    });
    await moveProcessedFiles(processedTranscripts);
    logger.info('Moved processed files', {
      count: processedTranscripts.length,
    });
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
