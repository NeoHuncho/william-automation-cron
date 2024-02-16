import { FileStat, createClient } from 'webdav';
import { voiceRecordingDirectory } from '../constants/constants.js';
import { BufferObject } from '../types/types.js';
import { logger } from './logger.js';

export const getUnprocessedNextCloudRecordings = async () => {
  const client = createClient(
    'https://cloud.williamguinaudie.com/remote.php/webdav',
    {
      username: 'william',
      password: process.env.NEXTCLOUD_PASSWORD,
    }
  );

  try {
    const directoryItems = await client.getDirectoryContents(
      voiceRecordingDirectory
    );
    const data: BufferObject = {};
    for (const item of directoryItems as FileStat[]) {
      if (item.type !== 'file') {
        logger().error('Item is not a file:', item);
        continue;
      }
      if (item.filename.includes('[DONE]')) continue;

      const fileContent = await client.getFileContents(item.filename, {
        format: 'binary',
      });
      if (fileContent instanceof Buffer) data[item.filename] = fileContent;
      else
        logger().error('Error downloading file: fileContent is not a buffer', {
          name: item.filename,
          type: typeof fileContent,
        });
    }
    return data;
  } catch (error) {
    console.error('Error downloading files:', error);
  }
};
