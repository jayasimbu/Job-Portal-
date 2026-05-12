/**
 * Normalizes backend AI responses into a standard UI format
 */
export const formatAIResponse = (responseType, data) => {
  if (!data) return null;

  switch (responseType) {
    case 'ATS_ANALYSIS':
      return {
        score: data.overall_score || data.ats_score || 0,
        scoreBreakdown: {
          format: data.breakdown?.format || 0,
          skills: data.breakdown?.skills || 0,
          experience: data.breakdown?.experience || 0,
        },
        strengths: data.strengths || [],
        missingSkills: data.missing_keywords || data.missing_skills || [],
        recommendations: data.recommendations || []
      };
      
    case 'JD_MATCH':
      return {
        matchPercentage: data.match_percentage || 0,
        matchedSkills: data.matched_skills || [],
        missingSkills: data.missing_skills || [],
        roleCompatibility: data.role_compatibility || 'Unknown',
        suggestions: data.suggestions || []
      };

    case 'CAREER_RECOMMENDATION':
      return (data.recommended_jobs || data.topJobs || []).map(job => ({
        id: job.id || Math.random().toString(36).substr(2, 9),
        title: job.title || 'Unknown Role',
        company: job.company || 'Top Employer',
        location: job.location || 'Remote',
        matchScore: job.score || job.match_score || 0,
        skills: job.matchedSkills || job.skills || []
      }));

    default:
      return data;
  }
};



