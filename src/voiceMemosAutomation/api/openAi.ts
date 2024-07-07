import axios from 'axios';
import { logger } from '../../common/logger.js';
import { aiPrompts } from '../constants/aiPrompts.js';
import { StringMap, TranscriptMap } from '../types/types.js';
import { determineTranscriptType } from '../utils/determineTranscriptType.js';

const getOpenAiLLMPrompt = async (prompt: string) =>
  axios
    .post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',

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
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    )
    .catch((error) => {
      logger.error('Error getting OpenAi LLMPrompt:', error);
      return undefined;
    });

const formatPrompt = (prompt: string, text: string) => {
  return `${prompt}\n${text}`;
};

export const aiParseVoiceMemo = async (transcripts: StringMap) => {
  const aiScripts: TranscriptMap = {};
  for (const [key, file] of Object.entries(transcripts)) {
    const type = determineTranscriptType(key);
    const entries = Object.entries(aiPrompts[type]);
    for (const [transcriptType, prompt] of entries) {
      const res = await getOpenAiLLMPrompt(
        formatPrompt(prompt as string, file)
      );
      if (res === undefined) continue;
      if (!aiScripts[key]) {
        aiScripts[key] = {};
      }
      aiScripts[key][transcriptType] = res.data.choices[0].message.content;
      if (transcriptType == 'enhanced') {
        const title =
          res.data.choices[0].message.content.match(/(?<=^# |^#).+?(?=\n)/);
        if (title) {
          aiScripts[key]['title'] = title[0];
        } else aiScripts[key]['title'] = 'No title found';
      }
    }
  }
  return aiScripts;
};
