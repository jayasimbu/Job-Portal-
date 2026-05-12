import skillsList from '../data/skills_list.json';

/**
 * Extracts skills from a given text based on the skills_list.json keys.
 * @param {string} text - The text to extract skills from.
 * @returns {string[]} - Array of unique skills found.
 */
export const extractSkills = (text) => {
  if (!text) return [];
  
  const skills = Object.keys(skillsList);
  const foundSkills = [];
  
  const lowerText = text.toLowerCase();
  
  skills.forEach(skill => {
    const lowerSkill = skill.toLowerCase();
    // Using a simple inclusion check, but could be improved with word boundaries
    if (lowerText.includes(lowerSkill)) {
      foundSkills.push(skill);
    }
  });
  
  return [...new Set(foundSkills)];
};

export default extractSkills;
