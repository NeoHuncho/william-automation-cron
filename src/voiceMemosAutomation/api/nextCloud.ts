import { FileStat, createClient } from 'webdav';
import { logger } from '../../common/logger.js';
import { voiceRecordingDirectory } from '../constants/constants.js';
import { FileInfoMap } from '../types/types.js';

export const getUnprocessedNextCloudRecordings = async () => {
  const client = createClient(
    `${process.env.NEXTCLOUD_HOST}/remote.php/webdav`,
    {
      username: 'william',
      password: process.env.NEXTCLOUD_PASSWORD,
    }
  );
  try {
    const directoryItems = await client.getDirectoryContents(
      voiceRecordingDirectory()
    );
    const data: FileInfoMap = {};
    for (const item of directoryItems as FileStat[]) {
      if (item.type !== 'file') {
        if (item.type === 'directory') continue;
        logger.error('Item is not a file:', item);
        continue;
      }
      if (item.basename === '.DS_Store') continue;
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
    logger.error('Error downloading files:', {
      errorName: error.name,
      errorMessage: error.message,
      errorStack: error.stack,
    });
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
        `${voiceRecordingDirectory()}/${file}`,
        `${voiceRecordingDirectory()}/processed/${file}`
      );
    }
  } catch (error) {
    logger.error('Error moving files:', {
      errorName: error.name,
      errorMessage: error.message,
      errorStack: error.stack,
    });
  }
};
