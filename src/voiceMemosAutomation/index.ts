import dotenv from 'dotenv';
import { projectRoot } from '../common/utils/getDirname.js';
import { aiParseVoiceMemo } from './api/openAI.js';
import { VoiceRecordingType } from './types/types.js';
dotenv.config({ path: projectRoot + '/.env' });

const index = async () => {
  // await getUnprocessedNextCloudRecordings();
  // await transcribeAudio();
  await aiParseVoiceMemo({
    type: VoiceRecordingType.DI,
    voiceMemoTranscriptFileName: 'Di-Clip audio (2024-01-04_00-13-09-572).txt',
  });
};
index();
