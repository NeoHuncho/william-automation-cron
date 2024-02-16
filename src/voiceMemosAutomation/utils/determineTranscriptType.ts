import { VoiceRecordingType, VoiceRecordingTypes } from '../types/types.js';

export function determineTranscriptType(
  str: string
): VoiceRecordingTypes | undefined {
  const enumValues = Object.values(VoiceRecordingTypes) as string[];
  const prefix = str.slice(0, 2);
  const match = enumValues.find((val) => prefix.includes(val));
  return match ? VoiceRecordingTypes[match as VoiceRecordingType] : undefined;
}
