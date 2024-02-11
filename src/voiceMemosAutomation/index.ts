import dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import { projectRoot } from '../common/utils/getDirname.js';
import { addPageToDatabase, startNotionClient } from './api/notion.js';
import { notionDatabaseId } from './constants/notionDatabaseId.js';
dotenv.config({ path: projectRoot + '/.env' });

const index = async () => {
  const notionClient = startNotionClient();
  // await getUnprocessedNextCloudRecordings();
  // await transcribeAudio();
  // await aiParseVoiceMemo({
  //   type: VoiceRecordingType.DI,
  //   voiceMemoTranscriptFileName: 'Di-Clip audio (2024-01-04_00-13-09-572).txt',
  // });
  const text = await readFile(
    'api/temp/aiScript/Di-Clip audio (2024-01-04_00-13-09-572).txt',
    'utf-8'
  );

  await addPageToDatabase({
    client: notionClient,
    databaseId: notionDatabaseId.DI,
    title: 'Hash Trip and Reflections on Berlin Trip',
    text,
  });
};
index();
