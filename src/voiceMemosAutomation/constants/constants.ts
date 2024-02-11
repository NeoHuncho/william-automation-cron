export const voiceRecordingDirectory = '/voice recording';
export const diaryEntryOrDreamPrompt = (type: string) =>
  `from the text below, generate a title prefixed with "title:". Then, in markdown, provide 2-3 bullet points summarizing my ${type} and give me a refined version of the entry without significant vocabulary changes and keep all the detail shared in the entry.`;
export const textCleaned =
  'from the text below, add punctuation. do not add any word that is not present. keep all the detail shared in the entry.';
export const documentationPrompt = `from the text below, generate a title prefixed with "title:". Then, in markdown, make a bulleted list of the main points of the text. Do not miss out anything mentioned in the text.`;
