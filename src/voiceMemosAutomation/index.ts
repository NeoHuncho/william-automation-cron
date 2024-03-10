import dotenv from 'dotenv';
import cron from 'node-cron';
import { initLogger, logger } from '../common/logger.js';
import { projectRoot } from '../common/utils/getDirname.js';
import { transcribeAudio } from './api/deepgram.js';
import {
  getUnprocessedNextCloudRecordings,
  moveProcessedFiles,
} from './api/nextCloud.js';
import { addPageToDatabase, startNotionClient } from './api/notion.js';
import { aiParseVoiceMemo } from './api/openAi.js';
dotenv.config({ path: projectRoot + '/.env' });

const processRecordings = async () => {
  initLogger();
  try {
    const recordings = await getUnprocessedNextCloudRecordings();
    if (Object.keys(recordings).length === 0) return;
    const transcripts = await transcribeAudio(recordings);
    const markdownScripts = await aiParseVoiceMemo(transcripts);
    const notionClient = startNotionClient();

    const processedTranscripts = await addPageToDatabase({
      client: notionClient,
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
cron.schedule('*/5 * * * *', processRecordings);
