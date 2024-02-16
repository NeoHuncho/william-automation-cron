import { createClient } from '@deepgram/sdk';
import { fileTypeFromBuffer } from 'file-type';
import { BufferObject, stringObject } from '../types/types.js';
import { convertBufferToWav } from '../utils/convertBufferToWav.js';
import { logger } from './logger.js';
export const transcribeAudio = async (mp3Files: BufferObject) => {
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
  const transcripts: stringObject = {};
  for (const [key, file] of Object.entries(mp3Files)) {
    const type = await fileTypeFromBuffer(file);
    let wavFile = file;
    if (type.ext !== 'wav') {
      try {
        await convertBufferToWav(file, type.ext);
      } catch (error) {
        logger().error('Error converting file to wav:', {
          name: key,
          type: type.ext,
          error,
        });
        continue;
      }
    }

    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      wavFile,
      {
        model: 'nova',
      }
    );
    if (error) {
      logger().error('Error transcribing file:', {
        name: key,
        error,
      });
      continue;
    }

    transcripts[key] = result.results.channels[0].alternatives[0].transcript;
  }
  return transcripts;
};
