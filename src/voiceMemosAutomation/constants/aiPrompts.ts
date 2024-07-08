import { RecordingTypeKey, TranscriptVariants } from '../types/types.js';
import {
  diaryEntryOrDreamPrompt,
  textCleaned,
  yearlyReviewPrompt,
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
  Y: {
    transcript: textCleaned,
    enhanced: yearlyReviewPrompt,
  },
  Q: {
    transcript: textCleaned,
  },
};
