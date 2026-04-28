import React from 'react';
import PageTemplate from '../../core/components/PageTemplate';
import { infoPagesData } from '../../core/data/infoPagesData';

export default function EnterpriseHiring() {
  const data = infoPagesData['enterprise'];
  return (
    <PageTemplate
      title={data.title}
      subtitle={data.description}
      features={data.features}
      benefit={data.benefit}
    />
  );
}
