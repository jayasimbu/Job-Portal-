import { calculateATS } from '../utils/calculateATS';

/**
 * Calculates ATS score for a resume.
 * @param {string} resumeText - Text from the resume.
 * @param {object} matchData - Optional match data to include in scoring.
 * @returns {number} - ATS score.
 */
export const getATSScore = (resumeText, matchData = {}) => {
  const data = {
    resumeText,
    matchedSkills: matchData.matchedSkills?.length || 0,
    totalJDSkills: matchData.jdSkills?.length || 0
  };
  
  return calculateATS(data);
};

export default { getATSScore };
