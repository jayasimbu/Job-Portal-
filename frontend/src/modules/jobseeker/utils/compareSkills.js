/**
 * Compares resume skills against job description skills.
 * @param {string[]} resumeSkills - Skills extracted from the resume.
 * @param {string[]} jdSkills - Skills extracted from the JD.
 * @returns {object} - Object containing matched and missing skills.
 */
export const compareSkills = (resumeSkills, jdSkills) => {
  const matched = jdSkills.filter(skill => resumeSkills.includes(skill));
  const missing = jdSkills.filter(skill => !resumeSkills.includes(skill));
  
  return { matched, missing };
};

export default compareSkills;
