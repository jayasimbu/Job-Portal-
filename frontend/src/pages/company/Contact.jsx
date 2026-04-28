import React from 'react';
import PageTemplate from '../../core/components/PageTemplate';

export default function Contact() {
  return (
    <PageTemplate
      title="Contact Us"
      subtitle="We would love to hear from you."
      features={[
        "Email: careerautoai@gmail.com",
        "Phone: +91 XXXXX XXXXX",
        "Support Hours: Mon–Fri, 9AM–6PM"
      ]}
      steps={[]}
      benefit="We typically respond within 24 hours."
    />
  );
}
