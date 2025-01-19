import fetch from 'node-fetch';
import { voiceRecordingDirectory } from '../voiceMemosAutomation/constants/nextcloudConstants.js';
import { createNextcloudClient } from './nextcloud.js';

const createFileInNextcloud = async (path: string, content: string) => {
  const client = createNextcloudClient();
  await client.putFileContents(path, content, { overwrite: true });
};

const createVikunjaTask = async (title: string, priority: number) => {
  await fetch(`${process.env.VIKUNJA_HOST}/api/v1/projects/1/tasks`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.VIKUNJA_API_KEY}`,
    },
    body: JSON.stringify({
      title,
      priority,
      due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }),
  });
};

const shouldLogToConsole = () => {
  return process.env.NODE_ENV !== 'production';
};

export const logger = {
  error: async (message: string, errorInfo: object) => {
    if (shouldLogToConsole()) {
      console.error('Error:', message, errorInfo);
      return;
    }
    const filePath = `${voiceRecordingDirectory()}/breaking-error.txt`;
    const moveFileDisclaim = `PLEASE MOVE TO THE /errors DIRECTORY WHEN FIXED\n\n`;
    const content = `${moveFileDisclaim}${message}\n${JSON.stringify(
      errorInfo,
      null,
      2
    )}`;
    await createFileInNextcloud(filePath, content);
    await createVikunjaTask('breaking error on voice memo automation', 5);
  },
  warn: async (message: string, warnInfo: object) => {
    if (shouldLogToConsole()) {
      console.warn('Warning:', message, warnInfo);
      return;
    }
    const filePath = `${voiceRecordingDirectory()}/errors/error_${new Date(
      Date.now() + 24 * 60 * 60 * 1000
    ).toISOString()}.txt`;
    const content = `${message}\n${JSON.stringify(warnInfo, null, 2)}`;
    await createFileInNextcloud(filePath, content);
    await createVikunjaTask('error on voice memo automation', 3);
  },
};

export const hasUnsolvedBreakingError = async () => {
  const client = createNextcloudClient();

  const exists = await client.exists(
    `${voiceRecordingDirectory()}/breaking-error.txt`
  );
  return exists;
};
