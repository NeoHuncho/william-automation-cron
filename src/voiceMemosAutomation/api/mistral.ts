import axios from 'axios';
import { aiPrompts } from '../constants/aiPrompts.js';
import { stringObject, transcriptTypeObject } from '../types/types.js';
import { determineTranscriptType } from '../utils/determineTranscriptType.js';
import { logger } from './logger.js';

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

export const aiParseVoiceMemo = async (transcripts: stringObject) => {
  const aiScripts: transcriptTypeObject = {};
  for (const [key, file] of Object.entries(transcripts)) {
    const type = determineTranscriptType(key);
    if (type === undefined) {
      logger().error('could not find type of file', {
        file: key,
      });
      continue;
    }

    Object.entries(aiPrompts[type]).forEach(
      async ([transcriptType, prompt]) => {
        const res = await getMistralLLMPrompt(
          formatPrompt(prompt as string, file)
        );
        aiScripts[key][transcriptType] = res.data.choices[0].message.content;
      }
    );
  }
  return aiScripts;
};
