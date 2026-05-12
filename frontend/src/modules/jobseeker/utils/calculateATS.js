/**
 * Simulates ATS score calculation based on various factors.
 * @param {object} data - Analysis data including skills, length, formatting, etc.
 * @returns {number} - ATS score (0-100).
 */
export const calculateATS = (data) => {
  const { resumeText, matchedSkills, totalJDSkills } = data;
  
  let score = 0;
  
  // 1. Skill Match Weight (50%)
  if (totalJDSkills > 0) {
    score += (matchedSkills / totalJDSkills) * 50;
  }
  
  // 2. Length Check (10%) - Assuming ideal length is between 500 and 2000 words
  const wordCount = resumeText ? resumeText.split(/\s+/).length : 0;
  if (wordCount >= 500 && wordCount <= 2000) {
    score += 10;
  } else if (wordCount > 0) {
    score += 5;
  }
  
  // 3. Contact Info Presence (10%)
  if (resumeText && (resumeText.includes('@') || resumeText.match(/\d{10}/))) {
    score += 10;
  }
  
  // 4. Section Presence (20%)
  const sections = ['education', 'experience', 'projects', 'skills', 'summary'];
  let sectionScore = 0;
  sections.forEach(section => {
    if (resumeText && resumeText.toLowerCase().includes(section)) {
      sectionScore += 4;
    }
  });
  score += sectionScore;
  
  // 5. Formatting Bonus (10%)
  score += 10; // Default bonus for now
  
  return Math.min(Math.round(score), 100);
};

export default calculateATS;
