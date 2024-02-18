import { RecordingTypeKey, VoiceRecordingVariants } from '../types/types.js';

export function determineTranscriptType(
  str: string
): VoiceRecordingVariants | undefined {
  const enumValues = Object.values(VoiceRecordingVariants) as string[];
  const prefix = str.slice(0, 2);
  const match = enumValues.find((val) => prefix.includes(val));
  return match ? VoiceRecordingVariants[match as RecordingTypeKey] : undefined;
}
