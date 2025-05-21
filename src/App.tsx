import React, { useState } from 'react';
import Layout from './components/Layout';
import ApiKeyInput from './components/ApiKeyInput';
import ImageUploader from './components/ImageUploader';
import ProcessingStatus from './components/ProcessingStatus';
import SummaryDisplay from './components/SummaryDisplay';
import { ApiKeyProvider } from './context/ApiKeyContext';
import { performOcr } from './services/ocrService';
import { generateSummary } from './services/summaryService';
import { SummaryResponse } from './types';

const AppContent: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [ocrText, setOcrText] = useState<string>('');
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStage, setProcessingStage] = useState<'idle' | 'ocr' | 'summary'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setOcrText('');
    setSummary(null);
    setError(null);
  };

  const handleProcessImage = async () => {
    if (!selectedImage) return;
    
    setIsProcessing(true);
    setError(null);
    setSummary(null);
    
    try {
      // Step 1: OCR Processing
      setProcessingStage('ocr');
      const extractedText = await performOcr(selectedImage);
      setOcrText(extractedText);
      
      // Step 2: Summary Generation
      setProcessingStage('summary');
      const generatedSummary = await generateSummary(extractedText, 'sk-f6daa71f7e8545afbc7e68b304b638fb');
      setSummary(generatedSummary);
    } catch (err) {
      setError(`Error processing image: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
      setProcessingStage('idle');
    }
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Image Analysis</h2>
        <p className="text-gray-600">Upload an image to extract and analyze its content</p>
      </div>
      
      <ImageUploader 
        onImageSelect={handleImageSelect} 
        disabled={false}
      />
      
      {selectedImage && !isProcessing && !summary && (
        <div className="text-center mb-6">
          <button
            onClick={handleProcessImage}
            className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition-colors duration-300 inline-flex items-center"
          >
            Analyze Image
          </button>
        </div>
      )}
      
      <ProcessingStatus isProcessing={isProcessing} stage={processingStage} />
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <SummaryDisplay summary={summary} ocrText={ocrText} />
    </>
  );
};

function App() {
  return (
    <ApiKeyProvider>
      <Layout>
        <AppContent />
      </Layout>
    </ApiKeyProvider>
  );
}

export default App;