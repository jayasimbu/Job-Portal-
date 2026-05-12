import React from 'react';
import PageTemplate from '../../core/components/PageTemplate';

export default function HelpCenter() {
  return (
    <PageTemplate
      title="Help Center"
      subtitle="Need help? We are here for you."
      features={[
        "Comprehensive FAQs",
        "Detailed User guides",
        "24/7 Contact support team"
      ]}
      steps={[
        "Search your issue",
        "Read helpful articles",
        "Contact support if needed"
      ]}
      benefit="Email: support@careerauto.ai"
    />
  );
}



