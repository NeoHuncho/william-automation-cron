import { TranscriptTypes, VoiceRecordingType } from '../types/types.js';
import {
  diaryEntryOrDreamPrompt,
  documentationPrompt,
  textCleaned,
} from './constants.js';

type PromptObject = {
  [K in VoiceRecordingType]?: {
    [J in keyof typeof TranscriptTypes]?: string;
  };
};
export const aiPrompts: PromptObject = {
  DI: {
    transcript: diaryEntryOrDreamPrompt('diary entry'),
    cleaned: textCleaned,
  },
  DR: {
    transcript: diaryEntryOrDreamPrompt('dreams'),
    cleaned: textCleaned,
  },
  Q: {
    transcript: textCleaned,
  },
  DO: {
    transcript: documentationPrompt,
  },
};
