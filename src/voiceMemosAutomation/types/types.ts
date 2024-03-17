export enum VoiceRecordingVariants {
  //diary entry
  DI,
  //quote
  Q,
  //dream
  DR,
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

export type FileInfoMap = { [k: string]: FileInfoContent };
export type StringMap = { [K: string]: string };
export type TranscriptMap = {
  [k: string]: {
    [J in keyof typeof TranscriptVariants]?: string;
  };
};
