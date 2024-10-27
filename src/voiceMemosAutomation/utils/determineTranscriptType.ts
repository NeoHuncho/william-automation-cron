import { VoiceRecordingVariants } from '../types/types.js';

export function determineTranscriptType(
  str: string
): VoiceRecordingVariants | undefined {
  const enumValues = Object.values(VoiceRecordingVariants).filter(
    (val) => typeof val === 'string'
  ) as VoiceRecordingVariants[];
  const prefix = str.slice(0, 3);

  if (!prefix.includes('-')) return undefined;

  const match = enumValues.find((val) =>
    prefix.toUpperCase().includes(val.toString().toUpperCase())
  );

  return match ?? undefined;
}
