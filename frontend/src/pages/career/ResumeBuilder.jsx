import React from 'react';
import PageTemplate from '../../core/components/PageTemplate';

export default function ResumeBuilder() {
  return (
    <PageTemplate
      title="Resume Builder"
      subtitle="Create ATS-friendly resumes using our AI-powered resume builder."
      features={[
        "Smart templates",
        "Keyword optimization",
        "Real-time ATS scoring"
      ]}
      steps={[
        "Enter your details",
        "AI optimizes content",
        "Export ATS-ready resume"
      ]}
      benefit="Improves chances of passing automated screening systems."
    />
  );
}
