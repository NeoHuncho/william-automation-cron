import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

export const getDirname = (metaUrl: string) => {
  const __filename = fileURLToPath(metaUrl);
  const __dirname = dirname(__filename);
  return __dirname;
};

export const projectRoot = resolve(getDirname(import.meta.url), '../../../');
