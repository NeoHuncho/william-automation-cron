export const voiceRecordingDirectory = () =>
  process.env.NODE_ENV !== 'production' ? '/devVoiceMemos' : '/voice recording';
export const diaryEntryOrDreamPrompt = (type: string) =>
  `In markdown, first provide a detailed title summarizing the entry in h1. then provide 2-3 bullet points summarizing my ${type}. then provide a  revised lengthy version of the text, that does not omit any details. Keep the same tone and vocabulary. KEEP Do not add unnecessary information or titles.`;
export const textCleaned =
  'from the text below, add punctuation. do not add any word that is not present. keep all the detail shared in the entry.';
