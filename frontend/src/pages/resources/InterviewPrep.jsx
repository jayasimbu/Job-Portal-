import React from 'react';
import PageTemplate from '../../core/components/PageTemplate';

export default function InterviewPrep() {
  return (
    <PageTemplate
      title="Interview Preparation"
      subtitle="Prepare for interviews with AI-based assistance."
      features={[
        "Common questions",
        "Mock interviews",
        "Performance feedback"
      ]}
      steps={[
        "Select your target role",
        "Take AI mock interview",
        "Review feedback and improve"
      ]}
      benefit="Boosts confidence and interview success rate."
    />
  );
}



