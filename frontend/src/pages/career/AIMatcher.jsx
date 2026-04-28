import React from 'react';
import PageTemplate from '../../core/components/PageTemplate';

export default function AIMatcher() {
  return (
    <PageTemplate
      title="AI Matcher"
      subtitle="Our AI Matcher analyzes your resume and skills to recommend the most suitable jobs."
      features={[
        "Skill-based job matching",
        "ATS score integration",
        "Personalized recommendations"
      ]}
      steps={[
        "Upload your resume",
        "AI scans your profile",
        "Get instant job matches"
      ]}
      benefit="Helps users find the right job faster with intelligent matching."
    />
  );
}
