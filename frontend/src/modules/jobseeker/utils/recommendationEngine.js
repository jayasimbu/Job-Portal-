import jobRoles from '../data/job_roles.json';

/**
 * Recommends jobs based on resume skills and match percentage.
 * @param {string[]} resumeSkills - Skills extracted from the resume.
 * @returns {object[]} - Array of recommended jobs with match details.
 */
export const recommendationEngine = (resumeSkills) => {
  if (!resumeSkills || resumeSkills.length === 0) return [];
  
  return jobRoles.map(job => {
    const matched = job.skills.filter(skill => resumeSkills.includes(skill));
    const matchPercentage = Math.round((matched.length / job.skills.length) * 100);
    
    return {
      ...job,
      matchPercentage,
      matchedSkills: matched,
      missingSkills: job.skills.filter(skill => !resumeSkills.includes(skill))
    };
  }).sort((a, b) => b.matchPercentage - a.matchPercentage);
};

export default recommendationEngine;
