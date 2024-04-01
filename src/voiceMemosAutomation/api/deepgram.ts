import { createClient } from '@deepgram/sdk';
import { logger } from '../../common/logger.js';
import { FileInfoMap, StringMap } from '../types/types.js';
export const transcribeAudio = async (recordings: FileInfoMap) => {
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
  const transcripts: StringMap = {};
  for (const [key, file] of Object.entries(recordings)) {
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      file.buffer,
      {
        model: 'nova',
        detect_language: true,
      }
    );
    if (error) {
      logger.error('Error transcribing file:', {
        fileName: key,
        errorName: error.name,
        errorMessage: error.message,
        errorStack: error.stack,
      });
      continue;
    }

    transcripts[key] = result.results.channels[0].alternatives[0].transcript;
  }
  return transcripts;
};
