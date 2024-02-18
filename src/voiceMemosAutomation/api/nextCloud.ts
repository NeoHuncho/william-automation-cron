import { FileStat, createClient } from 'webdav';
import { logger } from '../../common/logger.js';
import { voiceRecordingDirectory } from '../constants/constants.js';
import { FileInfoMap } from '../types/types.js';

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
    console.log('directoryItems:', directoryItems);
    const data: FileInfoMap = {};
    for (const item of directoryItems as FileStat[]) {
      if (item.type !== 'file') {
        if (item.type === 'directory' && item.basename === 'processed')
          continue;
        logger.error('Item is not a file:', item);
        continue;
      }

      const fileContent = await client.getFileContents(item.filename, {
        format: 'binary',
      });
      if (fileContent instanceof Buffer)
        data[item.basename] = {
          lastModified: item.lastmod,
          buffer: fileContent,
        };
      else
        logger.error('Error downloading file: fileContent is not a buffer', {
          name: item.basename,
          type: typeof fileContent,
        });
    }
    return data;
  } catch (error) {
    logger.error('Error downloading files:', error);
  }
};

export const moveProcessedFiles = async (files: string[]) => {
  const client = createClient(
    'https://cloud.williamguinaudie.com/remote.php/webdav',
    {
      username: 'william',
      password: process.env.NEXTCLOUD_PASSWORD,
    }
  );

  try {
    for (const file of files) {
      await client.moveFile(
        file,
        `${voiceRecordingDirectory}/processed/${file}`
      );
    }
  } catch (error) {
    logger.error('Error moving files:', error);
  }
};
