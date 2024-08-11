export const voiceRecordingDirectory = () =>
  process.env.NODE_ENV !== 'production' ? '/devVoiceMemos' : '/voice recording';
