import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, FileText, Scan, Loader2, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  uploadedFile: File | null;
  onScan: () => void;
  isAnalyzing: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  uploadedFile,
  onScan,
  isAnalyzing
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  });

  const getFilePreview = (file: File) => {
    const words = `Sample contract preview: This Service Agreement ("Agreement") is entered into on [Date] by and between [Company Name], a [State] corporation ("Company"), and [Client Name] ("Client"). The Company agrees to provide digital marketing consulting services as outlined in Exhibit A. Payment terms require monthly retainer of $5,000 due within 30 days of invoice. Contract includes automatic renewal clause requiring 90-day notice for termination...`.split(' ');
    return words.slice(0, 50).join(' ') + '...';
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700"
      >
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? 'border-[#007c7c] bg-[#007c7c]/10'
              : uploadedFile
              ? 'border-[#007c7c] bg-[#007c7c]/5'
              : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/30'
          }`}
        >
          <input {...getInputProps()} />
          
          <motion.div
            animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {uploadedFile ? (
              <FileText className="w-16 h-16 mx-auto mb-4 text-[#007c7c]" />
            ) : (
              <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            )}
          </motion.div>

          {uploadedFile ? (
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {uploadedFile.name}
              </h3>
              <p className="text-gray-400 mb-4">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <p className="text-sm text-gray-500">
                Click to upload a different file
              </p>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {isDragActive ? 'Drop your contract here' : 'Upload Contract Document'}
              </h3>
              <p className="text-gray-400 mb-4">
                Drag and drop or click to select your PDF, DOC, or TXT file
              </p>
              <p className="text-sm text-gray-500">
                Supports PDF, Word, and text documents up to 10MB
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* File Preview */}
      {uploadedFile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
        >
          <h4 className="text-lg font-semibold mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-[#007c7c]" />
            Document Preview
          </h4>
          <div className="bg-gray-900/50 rounded-xl p-4 text-sm text-gray-300 leading-relaxed">
            {getFilePreview(uploadedFile)}
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-400">
            <AlertCircle className="w-4 h-4 mr-2" />
            Showing first ~300 characters
          </div>
        </motion.div>
      )}

      {/* Scan Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        onClick={onScan}
        disabled={!uploadedFile || isAnalyzing}
        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center space-x-3 transition-all duration-300 ${
          !uploadedFile || isAnalyzing
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-[#007c7c] to-[#005a5a] hover:from-[#008888] hover:to-[#006666] text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
        }`}
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Analyzing Document...</span>
          </>
        ) : (
          <>
            <Scan className="w-6 h-6" />
            <span>Scan Document for Risks</span>
          </>
        )}
      </motion.button>

      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
        >
          <div className="flex items-center mb-4">
            <Loader2 className="w-5 h-5 mr-3 animate-spin text-[#007c7c]" />
            <span className="text-lg font-medium">AI Analysis in Progress</span>
          </div>
          <div className="space-y-2 text-sm text-gray-400">
            <p>• Reading document content...</p>
            <p>• Identifying key contract terms...</p>
            <p>• Analyzing risk factors...</p>
            <p>• Generating recommendations...</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FileUpload;