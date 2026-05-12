import { useState, useCallback } from 'react';
import resumeParserService from '../services/resumeParserService';
import atsService from '../services/atsService';
import { extractSkills } from '../utils/extractSkills';

export const useResumeAnalysis = () => {
  const [resumeText, setResumeText] = useState('');
  const [resumeSkills, setResumeSkills] = useState([]);
  const [atsScore, setAtsScore] = useState(0);
  const [isParsing, setIsParsing] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  const analyzeResume = useCallback(async (file) => {
    setIsParsing(true);
    setResumeFile(file);
    try {
      const text = await resumeParserService.parseResume(file);
      const skills = extractSkills(text);
      const score = atsService.getATSScore(text);
      
      setResumeText(text);
      setResumeSkills(skills);
      setAtsScore(score);
    } catch (error) {
      console.error('Error parsing resume:', error);
    } finally {
      setIsParsing(false);
    }
  }, []);

  return {
    resumeText,
    resumeSkills,
    atsScore,
    isParsing,
    resumeFile,
    analyzeResume
  };
};

export default useResumeAnalysis;
