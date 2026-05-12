import React from 'react';
import JobSeekerSidebar from './JobSeekerSidebar';
import { useTheme } from '../../../core/context/ThemeContext';

const JobSeekerLayout = ({ children }) => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen bg-background-light dark:bg-background-dark transition-colors ${isDark ? 'dark' : ''}`}>
      {/* Sidebar */}
      <JobSeekerSidebar />

      {/* Main Content Area */}
      <main className="jobseeker-content-area flex flex-col min-h-screen">
        <div className="flex-1 p-4 lg:p-8">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Global CSS for layout synchronization */}
      <style dangerouslySetInnerHTML={{ __html: `
        body {
          overflow-x: hidden;
          width: 100%;
        }
        
        /* Ensure the body takes up the full viewport and handles the sidebar push on desktop */
        @media (min-width: 1024px) {
          body {
            padding-left: 0; /* Handled by .jobseeker-content-area */
          }
        }
      `}} />
    </div>
  );
};

export default JobSeekerLayout;



