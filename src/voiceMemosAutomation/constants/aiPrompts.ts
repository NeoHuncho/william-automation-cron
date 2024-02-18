import { RecordingTypeKey, TranscriptVariants } from '../types/types.js';
import {
  diaryEntryOrDreamPrompt,
  documentationPrompt,
  textCleaned,
} from './constants.js';

type PromptObject = {
  [K in RecordingTypeKey]?: {
    [J in keyof typeof TranscriptVariants]?: string;
  };
};
export const aiPrompts: PromptObject = {
  DI: {
    transcript: textCleaned,
    enhanced: diaryEntryOrDreamPrompt('diary entry'),
  },
  DR: {
    transcript: textCleaned,
    enhanced: diaryEntryOrDreamPrompt('dreams'),
  },
  Q: {
    transcript: textCleaned,
  },
  DO: {
    enhanced: documentationPrompt,
  },
};
