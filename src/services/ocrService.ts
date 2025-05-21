import axios from 'axios';
import { OcrResponse } from '../types';

const QWEN_API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
const QWEN_API_KEY = 'sk-336d31e080cf45168dc6322f467960ed'; // 建议从 .env 中读取

export const performOcr = async (imageFile: File): Promise<string> => {
  try {
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(imageFile);
    });

    const payload = {
      model: 'qwen-vl-ocr-latest',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64}`,
              }
            },
            {
              type: 'text',
              text: '请提取图像中的文字信息，输出纯文本结果。'
            }
          ]
        }
      ],
      stream: false
    };

    const response = await axios.post(QWEN_API_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${QWEN_API_KEY}`
      }
    });

    console.log('Qwen OCR raw response:', response.data);

    const choice = response.data?.choices?.[0];
    const content = choice?.message?.content;

    // content 可能是 string 或数组
    if (typeof content === 'string') {
      return content;
    } else if (Array.isArray(content)) {
      const textPart = content.find((c: any) => c.type === 'text');
      if (textPart && typeof textPart.text === 'string') {
        return textPart.text;
      }
    }

    throw new Error('OCR response missing content');
  } catch (error) {
    console.error('Qwen OCR error:', error);
    throw error;
  }
};
