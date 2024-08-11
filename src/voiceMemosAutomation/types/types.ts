import {
  generalPurposeEnhancedPrompt,
  reviewPrompt,
  textCleaned,
  yearlyReviewPrompt,
} from '../constants/promptsLLM.js';

export enum VoiceRecordingVariants {
  //diary entry
  DI = 'DI',
  //quote
  Q = 'Q',
  //dream
  DR = 'DR',
  //yearly review
  Y = 'Y',
  // topic
  T = 'T',
  // review
  R = 'R',
}

export enum TranscriptVariants {
  transcript,
  enhanced,
}

export type RecordingTypeKey = keyof typeof VoiceRecordingVariants;
type FileInfoContent = {
  lastModified: string;
  buffer: Buffer;
};

export type FileInfoMap = Record<string, FileInfoContent>;
export type StringMap = { [K: string]: string };
export type TranscriptMap = {
  [k: string]: {
    [J in keyof typeof TranscriptVariants]?: string;
  };
};

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
  R: {
    transcript: textCleaned,
    enhanced: reviewPrompt,
  },
};

export const notionTags = {
  Y: 'Yearly review',
  DI: 'Diary entry',
  DR: 'Dream',
  T: 'Topic',
  R: 'Art Review',
};
