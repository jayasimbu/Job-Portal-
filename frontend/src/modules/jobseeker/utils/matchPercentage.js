/**
 * Calculates the match percentage between resume skills and JD skills.
 * @param {string[]} matchedSkills - Array of matched skills.
 * @param {string[]} jdSkills - Array of total skills required by the JD.
 * @returns {number} - Match percentage (0-100).
 */
export const calculateMatchPercentage = (matchedSkills, jdSkills) => {
  if (!jdSkills || jdSkills.length === 0) return 0;
  
  const percentage = (matchedSkills.length / jdSkills.length) * 100;
  return Math.round(percentage);
};

export default calculateMatchPercentage;
