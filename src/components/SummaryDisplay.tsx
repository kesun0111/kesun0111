import React from 'react';
import { FileText, List } from 'lucide-react';
import { SummaryResponse, ExamResponse } from '../types';

interface SummaryDisplayProps {
  summary: ExamResponse | null;
  ocrText: string;
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summary, ocrText }) => {
  if (!summary) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 transition-all duration-300 hover:shadow-lg animate-fadeIn">
      <div className="flex items-center mb-4">
        <FileText className="text-purple-600 mr-2\" size={20} />
        <h2 className="text-xl font-semibold text-gray-800">Exam Analysis Results</h2>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2 flex items-center">
          <span className="inline-block w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-center mr-2">1</span>
          Overview
        </h3>
        <div className="p-4 bg-purple-50 rounded-md text-gray-800">
          <p className="mb-2"><strong>Exam Title:</strong> {summary.examData.exam_title}</p>
          <p><strong>Total Questions:</strong> {summary.examData.total_question_number}</p>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2 flex items-center">
          <span className="inline-block w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-center mr-2">2</span>
          Questions
        </h3>
        <div className="space-y-4">
          {summary.examData.question_list && summary.examData.question_list.map((question, index) => (
            <div key={question.question_id} className="p-4 bg-purple-50 rounded-md text-gray-800">
              <h4 className="font-medium mb-2">Question {index + 1}</h4>
              <p className="mb-2">{question.question_content}</p>
              {question.answer_options && (
                <div className="ml-4">
                  <p className="font-medium mb-1">Options:</p>
                  <ul className="space-y-1">
                    {question.answer_options.map((option) => (
                      <li key={option.option_id} className="flex">
                        <List className="text-purple-500 mr-2 flex-shrink-0 mt-1" size={16} />
                        <span>{option.option_content}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-2 flex items-center">
          <span className="inline-block w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-center mr-2">3</span>
          Raw Extracted Text
        </h3>
        <div className="p-4 bg-gray-50 rounded-md text-gray-600 max-h-60 overflow-y-auto">
          <pre className="whitespace-pre-wrap font-sans text-sm">{ocrText}</pre>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2 flex items-center">
          <span className="inline-block w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-center mr-2">4</span>
          Raw JSON Data
        </h3>
        <div className="p-4 bg-gray-50 rounded-md text-gray-600 max-h-60 overflow-y-auto">
          <pre className="whitespace-pre-wrap font-mono text-sm">{JSON.stringify(summary, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default SummaryDisplay;