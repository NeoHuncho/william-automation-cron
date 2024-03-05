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
  transcript,
  key,
}: {
  title: string;
  recordingAt: string;
  client: Client;
  pageText?: string;
  transcript?: string;
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

  if (transcript) {
    pageCreateProperties['children'] = [
      {
        object: 'block',
        type: 'toggle',
        toggle: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Transcript',
              },
            },
          ],
          children: [
            {
              object: 'block',
              type: 'paragraph',
              paragraph: {
                rich_text: [
                  {
                    type: 'text',
                    text: {
                      content: transcript,
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ];
  }

  if (pageText) {
    pageCreateProperties['children'].push(...markdownToBlocks(pageText));
  }

  await client.pages.create(pageCreateProperties);
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
        transcript: transcripts.transcript,
      });
      processedKeys.push(key);
    } catch (error) {
      console.log(error);
      // logger.error('Error creating page in Notion:', error);
    }
  }
  return processedKeys;
}
