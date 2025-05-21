import React, { useState } from 'react';
import { Key, CheckCircle } from 'lucide-react';
import { useApiKey } from '../context/ApiKeyContext';

const ApiKeyInput: React.FC = () => {
  const { apiKey, setApiKey, isKeyValid, setIsKeyValid } = useApiKey();
  const [inputValue, setInputValue] = useState(apiKey);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setApiKey(inputValue.trim());
      setIsKeyValid(true); // In a real app, we would validate the key against the API
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center mb-4">
        <Key className="text-purple-600 mr-2" size={20} />
        <h2 className="text-xl font-semibold text-gray-800">DeepSeek API Key</h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <input
              type="password"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter your DeepSeek API key"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              required
            />
            {isKeyValid && (
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                <CheckCircle size={18} />
              </span>
            )}
          </div>
          <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition-colors duration-300 flex items-center justify-center"
          >
            {isKeyValid ? 'Update Key' : 'Save Key'}
          </button>
        </div>
      </form>
      
      {isKeyValid && (
        <div className="mt-4 p-2 bg-green-50 border border-green-200 rounded-md text-green-800 text-sm flex items-center">
          <CheckCircle size={16} className="mr-2" />
          API key saved. You can now process images.
        </div>
      )}
    </div>
  );
};

export default ApiKeyInput;