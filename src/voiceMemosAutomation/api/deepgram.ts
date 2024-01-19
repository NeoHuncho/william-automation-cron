import { createClient } from '@deepgram/sdk';
import { readFileSync } from 'fs';
import { mkdir, readdir, writeFile } from 'fs/promises';
import path from 'path';
import { getDirname } from '../../common/utils/getDirname.js';
import { convertToWav } from '../utils/convertAudioToWav.js';

export const transcribeAudio = async () => {
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

  const tempDirPath = path.join(getDirname(import.meta.url), 'temp/audio');
  const files = await readdir(tempDirPath);

  for (const file of files) {
    const audioFilePath = path.join(tempDirPath, file);
    let wavFilePath;

    if (!file.endsWith('.wav')) {
      try {
        wavFilePath = audioFilePath.replace(/\.[^/.]+$/, '.wav');
        await convertToWav(audioFilePath, wavFilePath);
      } catch (e) {
        console.log('Error converting file:', file);
        console.error(e);
        continue;
      }
    } else {
      wavFilePath = audioFilePath;
    }

    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      readFileSync(wavFilePath),
      {
        model: 'nova',
      }
    );
    if (error) {
      console.log('Error transcribing file:', file);
      console.error(error);
      continue;
    }

    await mkdir(path.join(getDirname(import.meta.url), 'temp/script'), {
      recursive: true,
    });
    const tempScriptDirPath = path.join(
      getDirname(import.meta.url),
      'temp/script'
    );

    await writeFile(
      path.join(tempScriptDirPath, wavFilePath.replace('.wav', '.txt')),
      result.results.channels[0].alternatives[0].transcript
    );
  }
};
