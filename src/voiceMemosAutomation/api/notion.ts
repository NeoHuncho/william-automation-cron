import { Client } from '@notionhq/client';
import { BlockObjectRequest } from '@notionhq/client/build/src/api-endpoints.js';
import { markdownToBlocks } from '@tryfabric/martian';
import { logger } from '../../common/logger.js';
import { notionDatabaseId } from '../constants/notionDatabaseId.js';
import { FileInfoMap, TranscriptMap } from '../types/types.js';
import { determineTranscriptType } from '../utils/determineTranscriptType.js';
export const startNotionClient = () =>
  new Client({ auth: process.env.NOTION_API_KEY });

async function createEntryDatabase({
  title,
  tags,
  recordingAt,
  client,
  pageText,
  key,
}: {
  title: string;
  tags: string[];
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
    Tags: {
      multi_select: {
        options: tags.map((tag) => ({ name: tag })),
      },
    },
  };
  if (pageText)
    (properties['children'] = markdownToBlocks(
      pageText
    ) as BlockObjectRequest[]),
      await client.pages.create({
        parent: { database_id: notionDatabaseId[determineTranscriptType(key)] },
        // @ts-ignore
        properties: properties,
      });
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
    const tags = transcripts['tags']
      .split(',')
      .map((tag) => ({ name: tag.trim() }));
    if (tags.length === 0) {
      logger.error('No tags found:', key);
      continue;
    }
    if (transcripts.enhanced === undefined) {
      await createEntryDatabase({
        title: transcripts.transcript,
        tags,
        recordingAt: recording.lastModified,
        client,
        key,
      });
      processedKeys.push(key);
      continue;
    }
    await createEntryDatabase({
      title: transcripts['title'],
      tags,
      recordingAt: recording.lastModified,
      client,
      pageText: transcripts.enhanced,
      key,
    });
    processedKeys.push(key);
  }
  return processedKeys;
}
