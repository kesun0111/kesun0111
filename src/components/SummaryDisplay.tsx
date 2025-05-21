import React from 'react';
import { FileText, List } from 'lucide-react';
import { SummaryResponse } from '../types';

interface SummaryDisplayProps {
  summary: SummaryResponse | null;
  ocrText: string;
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summary, ocrText }) => {
  if (!summary) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 transition-all duration-300 hover:shadow-lg animate-fadeIn">
      <div className="flex items-center mb-4">
        <FileText className="text-purple-600 mr-2" size={20} />
        <h2 className="text-xl font-semibold text-gray-800">Summary Results</h2>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2 flex items-center">
          <span className="inline-block w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-center mr-2">1</span>
          Overview
        </h3>
        <div className="p-4 bg-purple-50 rounded-md text-gray-800">
          {summary.overview}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2 flex items-center">
          <span className="inline-block w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-center mr-2">2</span>
          Main Points
        </h3>
        <div className="p-4 bg-purple-50 rounded-md text-gray-800">
          <ul className="space-y-2">
            {summary.mainPoints.map((point, index) => (
              <li key={index} className="flex">
                <List className="text-purple-500 mr-2 flex-shrink-0 mt-1" size={16} />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-2 flex items-center">
          <span className="inline-block w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-center mr-2">3</span>
          Extracted Text
        </h3>
        <div className="p-4 bg-gray-50 rounded-md text-gray-600 max-h-60 overflow-y-auto">
          <pre className="whitespace-pre-wrap font-sans text-sm">{ocrText}</pre>
        </div>
      </div>
    </div>
  );
};

export default SummaryDisplay;