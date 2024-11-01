import { Client } from '@notionhq/client';
import { markdownToBlocks } from '@tryfabric/martian';
import { logger } from '../../common/logger.js';
import { notionDatabaseId } from '../constants/notionDatabaseId.js';
import { FileInfoMap, notionTags, TranscriptMap } from '../types/types.js';
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
  const tags = [];

  if (notionTags[determineTranscriptType(key)] !== undefined)
    tags.push({
      name: notionTags[determineTranscriptType(key)],
    });

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
    'Recording name': {
      rich_text: [
        {
          text: {
            content: key,
          },
        },
      ],
    },
    Tags: {
      multi_select: tags,
    },
  };

  const database_id =
    notionDatabaseId()[determineTranscriptType(key) === 'Q' ? 'Q' : 'DEFAULT'];
  const pageCreateProperties = {
    parent: { database_id },
    properties,
  };

  if (transcript) {
    const maxContentLength = 2000;
    const transcriptChunks =
      transcript.match(new RegExp(`.{1,${maxContentLength}}`, 'g')) || [];
    const transcriptBlocks = transcriptChunks.map((chunk) => ({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: chunk,
            },
          },
        ],
      },
    }));

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
          children: transcriptBlocks,
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
  recordings,
  scripts,
}: {
  recordings: FileInfoMap;
  scripts: TranscriptMap;
}) {
  const client = startNotionClient();
  const processedKeys: string[] = [];
  for (const [key, transcripts] of Object.entries(scripts)) {
    const recording = recordings[key];
    if (recording === undefined) {
      logger.warn('Recording not found:', {
        key,
      });
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
      logger.error('Error creating page in Notion:', error);
    }
  }
  return processedKeys;
}
