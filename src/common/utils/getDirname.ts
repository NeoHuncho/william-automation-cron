import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

export const getDirname = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  return __dirname;
};

export const projectRoot = resolve(getDirname(), '../../../');

console.log(projectRoot);
