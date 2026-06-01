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
      const data = await matchJd({ resume_text: resumeText, job_description: jdText });
      
      const mappedResults = {
        matchPercentage: Math.round(data.ats_score || data.final_score || data.matchScore || 0),
        matchedSkills: data.matched_keywords || data.matchedSkills || [],
        missingSkills: data.missing_keywords || data.missingSkills || [],
        feedback: data.llm_enhanced_feedback || data.feedback || "Analysis complete."
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
