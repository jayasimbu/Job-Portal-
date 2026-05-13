import { useState, useCallback } from 'react';
import axios from 'axios';

/**
 * useAIAnalysis Hook
 * Centralizes AI intelligence flow: Parsing, ATS, and Recommendations.
 */
export const useAIAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const analyzeResume = useCallback(async (file) => {
    setIsAnalyzing(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      // 1. Upload and Parse Resume
      const response = await axios.post('/api/v1/jobseeker/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setAnalysisResult(response.data.data);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Analysis failed');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to analyze resume';
      setError(msg);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const getJobMatch = useCallback(async (resumeId, jobId) => {
    setIsAnalyzing(true);
    try {
      const response = await axios.get(`/api/v1/jobseeker/ats/match/${jobId}`);
      return response.data.data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const clearAnalysis = () => {
    setAnalysisResult(null);
    setError(null);
  };

  return {
    isAnalyzing,
    analysisResult,
    error,
    analyzeResume,
    getJobMatch,
    clearAnalysis
  };
};
