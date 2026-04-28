import React from 'react';
import PageTemplate from '../../core/components/PageTemplate';

export default function ResumeTips() {
  return (
    <PageTemplate
      title="Resume Tips"
      subtitle="Improve your resume with expert tips."
      features={[
        "Use action words",
        "Add measurable achievements",
        "Optimize for ATS keywords"
      ]}
      steps={[
        "Review your current draft",
        "Apply ATS optimization tips",
        "Run through our analyzer"
      ]}
      benefit="Increase chances of getting shortlisted."
    />
  );
}
