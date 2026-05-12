import { recommendationEngine } from '../utils/recommendationEngine';

/**
 * Gets job recommendations based on resume skills.
 * @param {string[]} resumeSkills - Skills extracted from the resume.
 * @returns {object[]} - Array of recommended jobs.
 */
export const getRecommendations = (resumeSkills) => {
  return recommendationEngine(resumeSkills);
};

export default { getRecommendations };
