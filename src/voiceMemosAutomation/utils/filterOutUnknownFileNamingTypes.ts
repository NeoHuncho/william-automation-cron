import { logger } from '../../common/logger.js';
import { FileInfoMap } from '../types/types.js';
import { determineTranscriptType } from './determineTranscriptType.js';

export const filterOutUnknownFileNamingTypes = (recordings: FileInfoMap) =>
  Object.entries(recordings)
    .filter(([key, file]) => {
      if (determineTranscriptType(key) === undefined) {
        logger.warn('unknown transcript type', {
          key,
        });
      }
      return determineTranscriptType(key) !== undefined;
    })
    .reduce((acc, [key, file]) => {
      acc[key] = file;
      return acc;
    }, {} as FileInfoMap);
