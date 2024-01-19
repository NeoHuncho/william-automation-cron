import { promises as fs } from 'fs';
import path from 'path';
import { FileStat, createClient } from 'webdav';
import { getDirname } from '../../common/utils/getDirname.js';
import { voiceRecordingDirectory } from '../constants/constants.js';

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
    const tempDirPath = path.join(getDirname(import.meta.url), 'temp/audio');
    await fs.mkdir(tempDirPath, { recursive: true });

    for (const item of directoryItems as FileStat[]) {
      if (!item.filename.includes('done') && item.type === 'file') {
        const fileContent = await client.getFileContents(item.filename, {
          format: 'binary',
        });
        const localFilePath = path.join(
          tempDirPath,
          path.basename(item.filename)
        );

        await fs.writeFile(localFilePath, fileContent as Buffer);
      }
    }

    console.log('Files downloaded successfully');
  } catch (error) {
    console.error('Error downloading files:', error);
  }
};
