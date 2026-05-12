import React from 'react';
import PageTemplate from '../../core/components/PageTemplate';

export default function ATSIntegration() {
  return (
    <PageTemplate
      title="ATS Integration"
      subtitle="Our system integrates with Applicant Tracking Systems to streamline hiring."
      features={[
        "Resume parsing",
        "Automated screening",
        "Candidate tracking"
      ]}
      steps={[
        "Connect existing ATS",
        "Auto-sync candidates",
        "Manage from unified dashboard"
      ]}
      benefit="Improves hiring workflow efficiency."
    />
  );
}



