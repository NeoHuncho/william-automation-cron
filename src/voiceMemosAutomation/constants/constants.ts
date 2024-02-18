export const voiceRecordingDirectory = '/voice recording';
export const diaryEntryOrDreamPrompt = (type: string) =>
  `from the text below, generate a title and tags. the title should be prefixed and suffixed by a ! and the tags by a ?. the tags should be separated by a comma and no space. Then, in markdown, provide 2-3 bullet points summarizing my ${type} and then a reworked text of the entry without significant vocabulary changes and keep all the detail and tone shared in the entry.`;
export const documentationPrompt = `from the text below, generate a title and tags. the title should be prefixed and suffixed by a ! and the tags by a ?. Then, in markdown, make a bulleted list of the main points of the text. Do not miss out anything mentioned in the text.`;
export const quotePrompt = `from the text below, generate a few tags. the tags should be pre and suffixed by a ?. Then re-return the text but add punctuation. do not add any word that is not present. keep all the detail shared in the entry. `;
export const textCleaned =
  'from the text below, add punctuation. do not add any word that is not present. keep all the detail shared in the entry.';
export const titlePreSuffix = '!';
export const tagsPreSuffix = '?';
