import React from 'react';
import PageTemplate from '../../core/components/PageTemplate';

export default function HowItWorks() {
  return (
    <PageTemplate
      title="How LINKUP Works"
      subtitle="From resume upload to hiring decisions — everything in one AI-powered platform."

      features={[
        "AI resume analysis and skill extraction",
        "Personalized job recommendations",
        "Real-time application tracking",
        "AI-driven hiring insights"
      ]}

      steps={[
        "Upload your resume",
        "AI analyzes skills and experience",
        "Get matched with relevant jobs",
        "Apply and track your applications",
        "Employers evaluate and shortlist candidates"
      ]}

      benefit="Simplifies the entire job seeking and hiring process using AI automation."
    />
  );
}



