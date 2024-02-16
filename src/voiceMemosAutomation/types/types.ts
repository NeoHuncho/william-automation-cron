export enum VoiceRecordingTypes {
  //diary entry
  DI,
  //quote
  Q,
  //dream
  DR,
  //doc
  DO,
}

export enum TranscriptTypes {
  transcript,
  cleaned,
}

export type VoiceRecordingType = keyof typeof VoiceRecordingTypes;

export type BufferObject = { [K in VoiceRecordingType]?: Buffer };
export type stringObject = { [K in VoiceRecordingType]?: string };
export type transcriptTypeObject = {
  [K in VoiceRecordingType]?: {
    [J in keyof typeof TranscriptTypes]?: string;
  };
};
