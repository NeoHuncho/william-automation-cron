import dotenv from 'dotenv';
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

const index = async () => {
  initLogger();
  try {
    const recordings = await getUnprocessedNextCloudRecordings();
    // console.log('starting transcribeAudio', Object.keys(recordings).length);
    const transcripts = await transcribeAudio(recordings);
    // console.log('starting aiParseVoiceMemo', Object.keys(transcripts).length);
    const markdownScripts = await aiParseVoiceMemo(transcripts);
    // console.log('starting addPageToDatabase');
    const notionClient = startNotionClient();

    const processedTranscripts = await addPageToDatabase({
      client: notionClient,
      recordings,
      scripts: markdownScripts,
    });
    // console.log('starting moveProcessedFiles');

    await moveProcessedFiles(processedTranscripts);
  } catch (error) {
    logger.error('🚨Unhandled error ocurred🚨 :', {
      errorName: error.name,
      errorMessage: error.message,
      errorStack: error.stack,
    });
  }
  process.exit(0);
};
index();
