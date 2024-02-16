import dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import { projectRoot } from '../common/utils/getDirname.js';
import { transcribeAudio } from './api/deepgram.js';
import { logger } from './api/logger.js';
import { aiParseVoiceMemo } from './api/mistral.js';
import { getUnprocessedNextCloudRecordings } from './api/nextCloud.js';
import { addPageToDatabase, startNotionClient } from './api/notion.js';
import { notionDatabaseId } from './constants/notionDatabaseId.js';
dotenv.config({ path: projectRoot + '/.env' });

const index = async () => {
  try {
    const mp3Files = await getUnprocessedNextCloudRecordings();
    const transcripts = await transcribeAudio(mp3Files);
    const markdownScripts = await aiParseVoiceMemo(transcripts);
    const text = await readFile(
      'api/temp/aiScript/Di-Clip audio (2024-01-04_00-13-09-572).txt',
      'utf-8'
    );
    const notionClient = startNotionClient();
    await addPageToDatabase({
      client: notionClient,
      databaseId: notionDatabaseId.DI,
      title: 'Hash Trip and Reflections on Berlin Trip',
      text,
    });
  } catch (error) {
    logger().error('🚨Unhandled error ocurred🚨 :', error);
  }
};
index();
