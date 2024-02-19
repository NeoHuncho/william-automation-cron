import dotenv from 'dotenv';
import { initLogger, logger } from '../common/logger.js';
import { projectRoot } from '../common/utils/getDirname.js';
import { transcribeAudio } from './api/deepgram.js';
import { aiParseVoiceMemo } from './api/mistral.js';
import {
  getUnprocessedNextCloudRecordings,
  moveProcessedFiles,
} from './api/nextCloud.js';
import { addPageToDatabase, startNotionClient } from './api/notion.js';
dotenv.config({ path: projectRoot + '/.env' });

const index = async () => {
  initLogger();
  try {
    const recordings = await getUnprocessedNextCloudRecordings();

    const transcripts = await transcribeAudio(recordings);
    console.log('transcripts', transcripts);
    const markdownScripts = await aiParseVoiceMemo(transcripts);
    console.log('markdown', markdownScripts);
    const notionClient = startNotionClient();

    const processedTranscripts = await addPageToDatabase({
      client: notionClient,
      recordings,
      scripts: markdownScripts,
    });
    console.log('processedTranscripts', processedTranscripts);

    await moveProcessedFiles(processedTranscripts);
  } catch (error) {
    logger.error('🚨Unhandled error ocurred🚨 :', error);
  }
};
index();
