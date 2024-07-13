import { RecordingTypeKey, TranscriptVariants } from '../types/types.js';
import {
  generalPurposeEnhancedPrompt,
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
    enhanced: generalPurposeEnhancedPrompt('my diary entry'),
  },
  DR: {
    transcript: textCleaned,
    enhanced: generalPurposeEnhancedPrompt('my dream diary entry'),
  },
  T: {
    transcript: textCleaned,
    enhanced: generalPurposeEnhancedPrompt('the topic discussed'),
  },
  Y: {
    transcript: textCleaned,
    enhanced: yearlyReviewPrompt,
  },
  Q: {
    transcript: textCleaned,
  },
};
