import { Client } from '@notionhq/client';
import { BlockObjectRequest } from '@notionhq/client/build/src/api-endpoints.js';
import { markdownToBlocks } from '@tryfabric/martian';
import { notionDatabaseId } from '../constants/notionDatabaseId.js';
import { FileInfoMap, TranscriptMap } from '../types/types.js';
import { determineTranscriptType } from '../utils/determineTranscriptType.js';

export const startNotionClient = () =>
  new Client({ auth: process.env.NOTION_API_KEY });

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
    if (transcripts.enhanced === undefined) {
      await client.pages.create({
        parent: { database_id: notionDatabaseId[determineTranscriptType(key)] },
        properties: {
          title: {
            title: [
              {
                text: {
                  content: key,
                },
              },
            ],
          },
        },
      });
    }
    // const richText = markdownToBlocks(text);

    // const response = await client.pages.create({
    //   parent: { database_id: databaseId },
    //   properties: {
    //     title: {
    //       title: [
    //         {
    //           text: {
    //             content: title,
    //           },
    //         },
    //       ],
    //     },
    //   },
    //   children: richText as BlockObjectRequest[],
    // });
  }
}
