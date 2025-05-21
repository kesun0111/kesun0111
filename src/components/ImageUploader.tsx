import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  disabled: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, disabled }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      onImageSelect(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      e.currentTarget.classList.add('border-purple-500', 'bg-purple-50');
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-purple-500', 'bg-purple-50');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-purple-500', 'bg-purple-50');
    
    if (!disabled && e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        onImageSelect(file);
        
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center mb-4">
        <ImageIcon className="text-purple-600 mr-2" size={20} />
        <h2 className="text-xl font-semibold text-gray-800">Upload Image</h2>
      </div>
      
      {!preview ? (
        <div
          className={`border-2 border-dashed ${
            disabled ? 'border-gray-300 bg-gray-50' : 'border-purple-300 hover:border-purple-500'
          } rounded-lg p-8 text-center transition-all duration-300`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className={`mx-auto mb-4 ${disabled ? 'text-gray-400' : 'text-purple-500'}`} size={40} />
          <p className={`mb-2 ${disabled ? 'text-gray-500' : 'text-gray-700'}`}>
            Drag and drop an image here, or click to select
          </p>
          <p className="text-sm text-gray-500 mb-4">Supported formats: JPEG, PNG, GIF</p>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
            disabled={disabled}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`px-4 py-2 rounded-md ${
              disabled
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            } transition-colors duration-300`}
            disabled={disabled}
          >
            Browse Files
          </button>
        </div>
      ) : (
        <div className="relative">
          <div className="rounded-lg overflow-hidden border border-gray-200">
            <img src={preview} alt="Preview" className="w-full h-auto max-h-80 object-contain" />
          </div>
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-100 transition-colors duration-300"
            title="Remove image"
          >
            <X size={20} className="text-red-600" />
          </button>
          <div className="mt-2 text-sm text-gray-600">
            {selectedImage?.name} ({Math.round(selectedImage?.size / 1024)} KB)
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;