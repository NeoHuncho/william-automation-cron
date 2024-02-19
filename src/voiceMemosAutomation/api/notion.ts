import { Client } from '@notionhq/client';
import { markdownToBlocks } from '@tryfabric/martian';
import { logger } from '../../common/logger.js';
import { notionDatabaseId } from '../constants/notionDatabaseId.js';
import { FileInfoMap, TranscriptMap } from '../types/types.js';
import { determineTranscriptType } from '../utils/determineTranscriptType.js';
export const startNotionClient = () =>
  new Client({ auth: process.env.NOTION_API_KEY });

async function createEntryDatabase({
  title,
  recordingAt,
  client,
  pageText,
  key,
}: {
  title: string;
  recordingAt: string;
  client: Client;
  pageText?: string;
  key: string;
}) {
  const properties = {
    title: {
      title: [
        {
          text: {
            content: title,
          },
        },
      ],
    },
    'Recorded at': {
      date: {
        start: new Date(recordingAt).toISOString(),
      },
    },
  };

  const pageCreateProperties = {
    parent: { database_id: notionDatabaseId[determineTranscriptType(key)] },
    properties,
  };
  if (pageText) {
    pageCreateProperties['children'] = markdownToBlocks(pageText);
  }
  const res = await client.pages.create(pageCreateProperties);
}

export async function addPageToDatabase({
  client,
  recordings,
  scripts,
}: {
  client: Client;
  recordings: FileInfoMap;
  scripts: TranscriptMap;
}) {
  const processedKeys: string[] = [];
  for (const [key, transcripts] of Object.entries(scripts)) {
    const recording = recordings[key];
    if (recording === undefined) {
      logger.error('Recording not found:', key);
      continue;
    }
    try {
      if (transcripts.enhanced === undefined) {
        await createEntryDatabase({
          title: transcripts.transcript,
          recordingAt: recording.lastModified,
          client,
          key,
        });
        processedKeys.push(key);
        continue;
      }
      await createEntryDatabase({
        title: transcripts['title'],
        recordingAt: recording.lastModified,
        client,
        pageText: transcripts.enhanced,
        key,
      });
      processedKeys.push(key);
    } catch (error) {
      logger.error('Error creating page in Notion:', error);
    }
  }
  return processedKeys;
}
