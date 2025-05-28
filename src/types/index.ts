export interface ApiKeyContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  isKeyValid: boolean;
  setIsKeyValid: (valid: boolean) => void;
}

export interface OcrResponse {
  ParsedResults: {
    ParsedText: string;
  }[];
  IsErroredOnProcessing: boolean;
}

export interface SummaryResponse {
  overview: string;
  mainPoints: string[];
}

export interface QwenOcrResponse {
  output: {
    choices: Array<{
      message: {
        content: Array<{
          text: string;
        }>;
      };
    }>;
  };
}
// ... existing code ...

export interface ExamQuestion {
  question_id: string;
  question_frame: number[];
  question_content: string;
  question_graph: string | number[];
  answer_options: ExamOption[];
}

export interface ExamOption {
  option_id: string;
  option_content: string;
  option_graph: string | number[];
}

export interface ExamData {
  exam_title: string;
  total_question_number: number;
  question_list: ExamQuestion[];
}

export interface ExamResponse {
  examData: ExamData;
}