import { useState, useCallback } from 'react';
import { matchJd } from '../services/jobseekerService';
import recommendationService from '../services/recommendationService';

export const useJDMatch = () => {
  const [matchResults, setMatchResults] = useState(null);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runMatchAnalysis = useCallback(async (resumeText, jdText) => {
    setIsAnalyzing(true);
    try {
      const data = await matchJd({ resume_text: resumeText, jd_text: jdText });
      const results = data.match || {};
      
      const mappedResults = {
        matchPercentage: results.match_score || 0,
        matchedSkills: results.matched_skills || [],
        missingSkills: results.missing_skills || [],
        feedback: results.reasoning || "Analysis complete."
      };
      
      const jobs = recommendationService.getRecommendations(mappedResults.matchedSkills);
      
      setMatchResults(mappedResults);
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
