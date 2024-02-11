import {
  diaryEntryOrDreamPrompt,
  documentationPrompt,
  textCleaned,
} from './constants.js';

export const aiPrompts = {
  DI: {
    diaryEntryPrompt: diaryEntryOrDreamPrompt('diary entry'),
    diaryEntryCleaned: textCleaned,
  },
  DR: {
    dreamPrompt: diaryEntryOrDreamPrompt('dreams'),
    dreamCleaned: textCleaned,
  },
  Q: {
    quotePrompt: textCleaned,
  },
  DO: {
    documentationPrompt: documentationPrompt,
  },
};
