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