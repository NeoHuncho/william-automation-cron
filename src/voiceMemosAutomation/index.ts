import dotenv from 'dotenv';
import { logger } from '../common/logger.js';
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
  try {
    const recordings = await getUnprocessedNextCloudRecordings();
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
    logger.error('🚨Unhandled error ocurred🚨 :', error);
  }
};
index();
