import { createClient } from 'webdav';
export const createNextcloudClient = () =>
  createClient(`${process.env.NEXTCLOUD_HOST}/remote.php/webdav`, {
    username: 'william',
    password: process.env.NEXTCLOUD_PASSWORD,
  });
