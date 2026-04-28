import React from 'react';
import PageTemplate from '../../core/components/PageTemplate';

export default function Applications() {
  return (
    <PageTemplate
      title="Applications Dashboard"
      subtitle="Track all your job applications in one place."
      features={[
        "Application status tracking",
        "Interview updates",
        "Real-time notifications"
      ]}
      steps={[
        "Apply through platform",
        "Track status automatically",
        "Get notified on updates"
      ]}
      benefit="Keeps users informed throughout the hiring process."
    />
  );
}
