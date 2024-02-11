import { Client } from '@notionhq/client';
import { BlockObjectRequest } from '@notionhq/client/build/src/api-endpoints.js';
import { markdownToBlocks } from '@tryfabric/martian';

export const startNotionClient = () =>
  new Client({ auth: process.env.NOTION_API_KEY });

export async function addPageToDatabase({
  client,
  databaseId,
  title,
  text,
}: {
  client: Client;
  databaseId: string;
  title: string;
  text: string;
}) {
  const richText = markdownToBlocks(text);

  const response = await client.pages.create({
    parent: { database_id: databaseId },
    properties: {
      title: {
        title: [
          {
            text: {
              content: title,
            },
          },
        ],
      },
    },
    children: richText as BlockObjectRequest[],
  });

  console.log(response);
}
