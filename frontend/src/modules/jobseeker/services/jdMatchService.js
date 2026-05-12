import { extractSkills } from '../utils/extractSkills';
import { compareSkills } from '../utils/compareSkills';
import { calculateMatchPercentage } from '../utils/matchPercentage';

/**
 * Performs JD Match analysis between resume text and JD text.
 * @param {string} resumeText - Text from the resume.
 * @param {string} jdText - Text from the job description.
 * @returns {object} - Match analysis results.
 */
export const analyzeMatch = (resumeText, jdText) => {
  const resumeSkills = extractSkills(resumeText);
  const jdSkills = extractSkills(jdText);
  
  const { matched, missing } = compareSkills(resumeSkills, jdSkills);
  const matchPercentage = calculateMatchPercentage(matched, jdSkills);
  
  return {
    resumeSkills,
    jdSkills,
    matchedSkills: matched,
    missingSkills: missing,
    matchPercentage
  };
};

export default { analyzeMatch };
