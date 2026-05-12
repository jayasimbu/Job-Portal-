import React from 'react';
import PageTemplate from '../../core/components/PageTemplate';

export default function AIRanking() {
  return (
    <PageTemplate
      title="AI Candidate Ranking"
      subtitle="Automatically rank candidates based on skills and job fit."
      features={[
        "ATS score-based ranking",
        "Skill match percentage",
        "AI-driven insights"
      ]}
      steps={[
        "Candidates apply",
        "AI evaluates profiles",
        "Ranks candidates automatically"
      ]}
      benefit="Improves hiring accuracy and saves recruiter time."
    />
  );
}



