import React from 'react';
import { Brain } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <div className="flex justify-center items-center mb-4">
            <Brain size={40} className="text-purple-600 mr-2" />
            <h1 className="text-3xl font-bold text-purple-800">Vision Insight</h1>
          </div>
          <p className="text-purple-600 max-w-xl mx-auto">
            Upload an image and let AI extract and summarize its content
          </p>
        </header>
        <main>{children}</main>
        <footer className="mt-12 text-center text-sm text-purple-500">
          <p>Powered by DeepSeek AI and OCR.space</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;