import axios from 'axios';
import { SummaryResponse } from '../types';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export const generateSummary = async (
  ocrText: string, 
  apiKey: string
): Promise<SummaryResponse> => {
  try {
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: "deepseek-chat",
        messages: [

          {
            role: "user",
            content: `您是一位善于总结的助手。
以下是从图像中提取的文本：
{ocr_text}

请总结其关键要点，并以以下格式返回：
1. 简要概述
2. 主要要点的项目符号列表 ${ocrText}`
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    
    // Parse the response to extract overview and main points
    const sections = content.split(/\d\./);
    const overview = sections[1]?.trim() || 'No overview available';
    const mainPoints = sections[2]?.split('\n')
      .filter(point => point.trim())
      .map(point => point.replace(/^[-•*]\s*/, '').trim()) || [];

    return {
      overview,
      mainPoints
    };
  } catch (error) {
    console.error('Summary generation error:', error);
    throw new Error('Failed to generate summary. Please check your API key and try again.');
  }
};