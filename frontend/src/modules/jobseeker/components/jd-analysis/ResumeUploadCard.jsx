import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, Loader2 } from 'lucide-react';

const ResumeUploadCard = ({ onUpload, isParsing, resumeFile, atsScore }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) onUpload(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onUpload(file);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
      <div className="p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="flex items-center justify-center size-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold">1</span>
          Upload Resume
        </h2>
        
        {!resumeFile ? (
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`
              relative border-2 border-dashed rounded-xl p-8 transition-all
              ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400'}
              flex flex-col items-center justify-center gap-4 cursor-pointer
            `}
          >
            <input
              type="file"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept=".pdf,.docx"
            />
            <div className="size-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Upload className="size-8" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-slate-700">Click to upload or drag and drop</p>
              <p className="text-sm text-slate-500 mt-1">PDF, DOCX up to 5MB</p>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-blue-600">
                  <FileText className="size-6" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 truncate max-w-[200px]">{resumeFile.name}</p>
                  <p className="text-sm text-slate-500">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button 
                onClick={() => window.location.reload()} // Simple way to reset for now
                className="text-sm text-blue-600 font-semibold hover:underline"
              >
                Change
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Parsing Status</span>
                {isParsing ? (
                  <span className="flex items-center gap-1.5 text-blue-600 font-medium">
                    <Loader2 className="size-4 animate-spin" />
                    Analyzing...
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                    <CheckCircle className="size-4" />
                    ATS Ready
                  </span>
                )}
              </div>
              
              {!isParsing && (
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">ATS Quality Score</span>
                    <span className="text-lg font-bold text-blue-600">{atsScore}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-1000"
                      style={{ width: `${atsScore}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUploadCard;
