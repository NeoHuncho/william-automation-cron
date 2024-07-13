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
