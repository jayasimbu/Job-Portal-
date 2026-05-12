import React from 'react';
import PageTemplate from '../../core/components/PageTemplate';

export default function About() {
  return (
    <PageTemplate
      title="About LINKUP"
      subtitle="LINKUP is an AI-driven career platform that connects skill analysis, learning, and hiring."
      features={[
        "AI-powered hiring innovation",
        "Bias-free recruitment system",
        "Smart career analytics"
      ]}
      steps={[
        "Mission: To simplify career growth using intelligent technology."
      ]}
      benefit="Vision: To create a smarter hiring ecosystem."
    />
  );
}



