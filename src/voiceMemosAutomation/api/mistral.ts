import axios from 'axios';
import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { getDirname } from '../../common/utils/getDirname.js';
import { aiPrompts } from '../constants/aiPrompts.js';
import { VoiceRecordingType } from '../types/types.js';

const getMistralLLMPrompt = async (prompt: string) =>
  await axios.post(
    'https://api.mistral.ai/v1/chat/completions',
    {
      model: 'mistral-medium',

      temperature: 0.2, // Lower value makes the output more focused and deterministic
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
    }
  );

const formatPrompt = (prompt: string, text: string) => {
  return `${prompt}\n${text}`;
};

export const aiParseVoiceMemo = async ({
  voiceMemoTranscriptFileName,
  type,
}: {
  voiceMemoTranscriptFileName: string;
  type: VoiceRecordingType;
}) => {
  if (!voiceMemoTranscriptFileName.endsWith('.txt')) {
    throw new Error('voiceMemoTranscriptFileName must be a path to a txt file');
  }
  const tempScriptDirPath = path.join(
    getDirname(import.meta.url),
    'temp/script/'
  );
  const file = await readFile(
    path.join(tempScriptDirPath + voiceMemoTranscriptFileName),
    'utf-8'
  );
  // get all text from file and put it in a const value
  await mkdir(path.join(getDirname(import.meta.url), 'temp/aiScript'), {
    recursive: true,
  });

  if (type === VoiceRecordingType.DI) {
    const res = await getMistralLLMPrompt(
      formatPrompt(aiPrompts.DI.diaryEntryPrompt, file)
    );
    await writeFile(
      path.join(
        getDirname(import.meta.url),
        'temp/aiScript',
        path.basename(voiceMemoTranscriptFileName)
      ),
      res.data.choices[0].message.content
    );
  }
};
