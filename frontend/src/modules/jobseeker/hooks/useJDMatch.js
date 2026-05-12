import { useState, useCallback } from 'react';
import jdMatchService from '../services/jdMatchService';
import recommendationService from '../services/recommendationService';

export const useJDMatch = () => {
  const [matchResults, setMatchResults] = useState(null);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runMatchAnalysis = useCallback((resumeText, jdText) => {
    setIsAnalyzing(true);
    try {
      const results = jdMatchService.analyzeMatch(resumeText, jdText);
      const jobs = recommendationService.getRecommendations(results.resumeSkills);
      
      setMatchResults(results);
      setRecommendedJobs(jobs);
    } catch (error) {
      console.error('Error running match analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const resetMatch = useCallback(() => {
    setMatchResults(null);
    setRecommendedJobs([]);
  }, []);

  return {
    matchResults,
    recommendedJobs,
    isAnalyzing,
    runMatchAnalysis,
    resetMatch
  };
};

export default useJDMatch;
