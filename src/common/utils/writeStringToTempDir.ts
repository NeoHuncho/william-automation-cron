import { writeFile } from 'fs/promises';

export async function writeStringToTempDir(content: string, filename: string) {
  await writeFile(`../../../temp/${filename}`, content);
}
