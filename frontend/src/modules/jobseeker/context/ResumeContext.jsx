import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchJobSeekerProfile } from '../services/jobseekerService';
import { getCurrentUserId } from '../../../core/auth/session';

const ResumeContext = createContext(null);

export const ResumeProvider = ({ children }) => {
  const [resumeData, setResumeData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize from cache or API
  useEffect(() => {
    const initResume = async () => {
      try {
        const cached = localStorage.getItem('linkup_resume_data');
        if (cached && cached !== 'undefined') {
          setResumeData(JSON.parse(cached));
        } else {
          await refreshResumeData();
        }
      } catch (err) {
        console.error("Failed to parse cached resume data", err);
        await refreshResumeData();
      }
    };
    initResume();
  }, []);

  const updateResumeData = (data) => {
    setResumeData(data);
    localStorage.setItem('linkup_resume_data', JSON.stringify(data));
  };

  const refreshResumeData = async () => {
    const userId = getCurrentUserId();
    if (!userId) return;
    
    try {
      setIsLoading(true);
      const res = await fetchJobSeekerProfile(userId);
      const profile = res?.profile;
      
      if (profile && profile.hasResume) {
        // Adapt API response to shared format
        const adapted = {
          hasResume: true,
          optimizationScore: profile.ats_score || 0,
          parsedData: {
            skills: profile.skills || [],
            experienceYears: profile.experience_years || 0,
          },
          rawText: profile.resume_text || ''
        };
        updateResumeData(adapted);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResumeData = () => {
    setResumeData(null);
    localStorage.removeItem('linkup_resume_data');
  };

  return (
    <ResumeContext.Provider value={{
      resumeData,
      isLoading,
      error,
      setIsLoading,
      updateResumeData,
      refreshResumeData,
      clearResumeData
    }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => useContext(ResumeContext);



