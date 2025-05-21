import React from 'react';
import { Loader2 } from 'lucide-react';

interface ProcessingStatusProps {
  isProcessing: boolean;
  stage: 'idle' | 'ocr' | 'summary';
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ isProcessing, stage }) => {
  if (!isProcessing) return null;

  const messages = {
    ocr: 'Extracting text from your image...',
    summary: 'Analyzing content and generating summary...',
    idle: '',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex items-center">
      <Loader2 className="animate-spin text-purple-600 mr-3" size={24} />
      <div>
        <h3 className="font-medium text-gray-800">Processing</h3>
        <p className="text-gray-600">{messages[stage]}</p>
      </div>
    </div>
  );
};

export default ProcessingStatus;