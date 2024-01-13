import { promises as fs } from 'fs';
import path from 'path';
import { createClient } from 'webdav';
import { getDirname } from '../common/utils/getDirname.js';

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
      '/voice%20recording'
    );
    const tempDirPath = path.join(getDirname(), 'temp');
    await fs.mkdir(tempDirPath, { recursive: true });
    //@ts-ignore
    for (const item of directoryItems) {
      if (item.type === 'file') {
        const fileContent = await client.getFileContents(item.filename, {
          format: 'binary',
        });
        const localFilePath = path.join(
          tempDirPath,
          path.basename(item.filename)
        );
        //@ts-ignore
        await fs.writeFile(localFilePath, fileContent);
      }
    }

    console.log('Files downloaded successfully');
  } catch (error) {
    console.error('Error downloading files:', error);
  }
};
