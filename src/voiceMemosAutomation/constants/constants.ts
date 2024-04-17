export const voiceRecordingDirectory = () =>
  process.env.NODE_ENV !== 'production' ? '/devVoiceMemos' : '/voice recording';
export const diaryEntryOrDreamPrompt = (type: string) =>
  `In markdown, first provide a detailed title in H1, summarizing the different topics shared in the text. then provide 2-3 bullet points summarizing my ${type}. then provide a  revised lengthy version of the text, that does not omit any details. Keep the same tone and vocabulary. Do not add unnecessary information or titles. Respond in the language of the following text.`;
export const textCleaned =
  'from the text below, add punctuation. do not add any word that is not present. keep all the detail shared in the entry.';
