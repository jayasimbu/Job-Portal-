import React from 'react';
import PageTemplate from '../../core/components/PageTemplate';

export default function TalentSourcing() {
  return (
    <PageTemplate
      title="Talent Sourcing"
      subtitle="Find the best candidates using AI-powered sourcing tools."
      features={[
        "Smart candidate filtering",
        "Skill-based search",
        "Candidate ranking"
      ]}
      steps={[
        "Define job criteria",
        "AI scans candidate pool",
        "Review top matches"
      ]}
      benefit="Helps recruiters find top talent quickly and efficiently."
    />
  );
}



