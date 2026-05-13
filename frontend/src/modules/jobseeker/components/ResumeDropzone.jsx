import React, { useState, useRef } from 'react';

export default function ResumeDropzone({ onFileUploaded }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (uploadedFile) => {
    if (uploadedFile.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }
    setFile(uploadedFile);
    simulateUpload(uploadedFile);
  };

  const simulateUpload = (uploadedFile) => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          if (onFileUploaded) onFileUploaded(uploadedFile);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="w-full">
      {!file ? (
        <div
          className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
            isDragActive 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' 
              : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf"
            onChange={handleChange}
          />
          <span className="material-symbols-outlined text-4xl text-blue-500 mb-4">upload_file</span>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Upload your resume</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Drag and drop your PDF here, or click to browse. Max size 5MB.
          </p>
        </div>
      ) : (
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-300 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg text-red-600 dark:text-red-400 shrink-0">
              <span className="material-symbols-outlined !text-3xl">picture_as_pdf</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{file.name}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            {uploadProgress === 100 && (
              <button 
                onClick={() => setFile(null)}
                className="text-slate-400 hover:text-red-500 transition-colors p-2"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            )}
          </div>
          
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ease-out ${uploadProgress === 100 ? 'bg-green-500' : 'bg-blue-600'}`}
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs font-semibold text-slate-500">
            <span>{uploadProgress < 100 ? 'Uploading...' : 'Upload complete!'}</span>
            <span>{uploadProgress}%</span>
          </div>
        </div>
      )}
    </div>
  );
}



