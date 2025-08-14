import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText } from 'lucide-react';

const FileUpload = ({ onFileUpload }) => {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onFileUpload(e.target.result);
      };
      reader.readAsText(file);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
        isDragActive
          ? 'border-primary-teal bg-primary-teal/10'
          : 'border-gray-300 hover:border-primary-teal hover:bg-gray-50'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center">
        {isDragActive ? (
          <>
            <FileText className="w-12 h-12 text-primary-teal mb-3" />
            <p className="text-primary-dark font-medium">Drop your file here...</p>
          </>
        ) : (
          <>
            <Upload className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-gray-700 font-medium mb-1">
              Drag & drop a file here, or click to select
            </p>
            <p className="text-sm text-gray-500">Supports .txt and .md files</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;