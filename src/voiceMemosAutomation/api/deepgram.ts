import { createClient } from '@deepgram/sdk';
import { fileTypeFromBuffer } from 'file-type';
import { logger } from '../../common/logger.js';
import { FileInfoMap, StringMap } from '../types/types.js';
import { convertBufferToWav } from '../utils/convertBufferToWav.js';
export const transcribeAudio = async (recordings: FileInfoMap) => {
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
  const transcripts: StringMap = {};
  for (const [key, file] of Object.entries(recordings)) {
    const type = await fileTypeFromBuffer(file.buffer);
    let wavFile = file.buffer;
    if (type.ext !== 'wav') {
      try {
        await convertBufferToWav(file.buffer, type.ext);
      } catch (error) {
        logger.error('Error converting file to wav:', {
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
      logger.error('Error transcribing file:', {
        name: key,
        error,
      });
      continue;
    }

    transcripts[key] = result.results.channels[0].alternatives[0].transcript;
  }
  return transcripts;
};
