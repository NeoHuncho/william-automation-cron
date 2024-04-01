export const extractTagsFromRecordingTitle = (title: string) => {
  if (!title.includes('+')) return null;

  const tags = title.split('+').slice(1);
  const lastTagCleaned = tags[tags.length - 1].split('.')[0];
  const finalTags = [...tags.slice(0, -1), lastTagCleaned];

  return finalTags;
};
