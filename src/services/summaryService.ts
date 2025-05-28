import axios from 'axios';
import { ExamResponse } from '../types';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

const sanitizeJsonString = (str: string): string => {
  // Remove any potential BOM characters
  str = str.replace(/^\uFEFF/, '');
  
  // Remove markdown code block syntax
  str = str.replace(/^```json\n/, '')
           .replace(/^```\n/, '')
           .replace(/```$/, '')
           .trim();

  // Attempt to fix common JSON formatting issues
  str = str.replace(/(?<!\\)\\n/g, '\\n') // Properly escape newlines
           .replace(/(?<!\\)\\"/g, '\\"')  // Properly escape quotes
           .replace(/[\u0000-\u001F]+/g, '') // Remove control characters
           .replace(/\u2028/g, '\\n')      // Replace line separator
           .replace(/\u2029/g, '\\n');     // Replace paragraph separator

  return str;
};

export const generateSummary = async (
  ocrText: string, 
  apiKey: string
): Promise<ExamResponse> => {
  try {  
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: `您是一位专业的考试试卷分析助手。
以下是从扫描的K12考试试卷中提取的文本：
${ocrText}

请分析文本并提取以下信息，以JSON格式返回：
1. 试卷标题 (exam_title)：提取试卷最顶部的标题（如“语文 A卷（共100分）”）。  
2. 总题目数量 (total_question_number)：仅统计实际题目数量（如选择题、填空题等，不含题组说明或材料文本）。  
3. 题目列表 (question_list)，每个题目必须包含完整的题干和选项（如题干截断则合并后续文本），无实际题目内容的题号（如仅提示“阅读选文”但无具体问题）需过滤掉， 每个题目包含：
   - 题目ID (question_id)
   - 题目内容 (question_content)
   - 题目图片位置 (question_graph)，如果没有图片则返回"N/A"
   - 选项列表 (answer_options)，每个选项包含：
     * 选项ID (option_id)
     * 选项内容 (option_content)
**示例处理逻辑：**  
- 若原文出现“阅读下面的选文，完成5~8题”，则将选文内容作为 reading_material，并仅为5~8题的实际小题创建题目项。  
- 若某题号（如6、7、8）无对应题干，则直接忽略，若题目内容为空（如仅题号无题干），则直接跳过，不生成该题。  

请确保返回的是有效的JSON格式,如果题目内容为空，则过滤掉，避免截断或冗余数据。。`
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      }, 
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    
    try {
      // Clean and sanitize the content before parsing
      const sanitizedContent = sanitizeJsonString(content);

      // Attempt to parse the sanitized JSON
      try {
        const examData = JSON.parse(sanitizedContent);
        return { examData };
      } catch (firstParseError) {
        // If first parse fails, try an alternative cleaning approach
        console.warn('First parse attempt failed, trying alternative cleaning...');
        
        // Remove any trailing commas in arrays/objects that might cause parsing errors
        const secondAttemptContent = sanitizedContent
          .replace(/,\s*([\]}])/g, '$1')
          .replace(/,\s*$/gm, '');
        
        const examData = JSON.parse(secondAttemptContent);
        return { examData };
      }
    } catch (parseError) {
      console.error('Failed to parse exam data:', parseError);
      console.error('Raw content:', content);
      console.error('Sanitized content:', sanitizeJsonString(content));
      throw new Error('Failed to parse exam data from API response. The API returned malformed JSON.');
    }
  } catch (error) {
    console.error('Exam data extraction error:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to extract exam data: ${error.message}`);
    }
    throw new Error('Failed to extract exam data. Please check your API key and try again.');
  }
};