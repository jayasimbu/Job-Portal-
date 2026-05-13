import { useState, useCallback } from 'react';
import apiClient from '../core/api/apiClient';

/**
 * useCandidateAnalysis Hook
 * Central intelligence for Employer candidate ranking and analysis.
 */
export const useCandidateAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState(null);

  const fetchCandidates = useCallback(async (jobId) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      // In LinkUp, we fetch candidates for a specific job
      const response = await apiClient.get(`/employer/jobs/${jobId}/applications`);
      const data = response.data?.data || response.data?.applications || [];
      
      // Automatic Ranking Logic (if not already ranked by backend)
      const rankedCandidates = data.sort((a, b) => {
        const scoreA = a.ats_score || a.match_score || 0;
        const scoreB = b.ats_score || b.match_score || 0;
        return scoreB - scoreA;
      });

      setCandidates(rankedCandidates);
      return rankedCandidates;
    } catch (err) {
      setError(err.message || "Failed to fetch candidates");
      return [];
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const updateCandidateStatus = useCallback(async (applicationId, status) => {
    try {
      const response = await apiClient.put(`/employer/applications/${applicationId}/status`, { status });
      return response.data?.success;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, []);

  const getAIVerdict = useCallback(async (candidateId, jobId) => {
    setIsAnalyzing(true);
    try {
      const response = await apiClient.get(`/employer/candidate/${candidateId}/match/${jobId}`);
      return response.data?.data || response.data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return {
    isAnalyzing,
    candidates,
    error,
    fetchCandidates,
    updateCandidateStatus,
    getAIVerdict
  };
};
