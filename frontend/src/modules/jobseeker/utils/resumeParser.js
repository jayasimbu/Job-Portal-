export const normalizeResumeData = (res) => {
  return {
    hasResume: res.hasResume || false,
    optimizationScore: res.ats_score || res.optimizationScore || 47.5,
    parsedData: {
      skills: res.skills?.missing || res.missing_skills || ['data entry', 'documentation', 'https', 'java', 'microsoft office'],
      experienceYears: res.experience || 0,
    },
    rawText: res.resume_text || ''
  };
};
