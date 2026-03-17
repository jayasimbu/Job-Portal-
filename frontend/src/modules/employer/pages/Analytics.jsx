import React, { useEffect, useState } from 'react';
import EmployerShell from '../components/EmployerShell';
import LegacyFeatureTabs from '../../../core/components/LegacyFeatureTabs';
import { fetchEmployerAnalytics } from '../services/employerService';

const sections = [
  {
    key: 'hiring-reports',
    label: 'Hiring Reports',
    description: 'Legacy hiring analytics and reports dashboard migrated as tab sections.',
    items: ['Funnel conversion metrics', 'Role-wise applicant quality', 'Offer acceptance rate trends'],
  },
  {
    key: 'performance',
    label: 'Performance',
    description: 'Recruitment velocity and team throughput indicators.',
    items: ['Time to shortlist', 'Interview cycle duration', 'Role closure rate'],
  },
];

const Analytics = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchEmployerAnalytics(1);
        setSummary(response?.analytics || null);
      } catch {
        setSummary(null);
      }
    };
    load();
  }, []);

  const sectionsWithLive = [
    ...sections,
    {
      key: 'live-summary',
      label: 'Live Summary',
      description: 'Live employer analytics from backend service.',
      items: summary
        ? [
            `Active jobs: ${summary.active_jobs}`,
            `Total applicants: ${summary.total_applicants}`,
            `Shortlisted: ${summary.shortlisted}`,
            `Interviews: ${summary.interviews}`,
          ]
        : ['Live analytics unavailable'],
    },
  ];

  return (
    <EmployerShell active="analytics">
      <h1 style={{ fontSize: '34px', marginBottom: '6px' }}>Analytics</h1>
      <p style={{ color: '#64748b', marginBottom: '16px' }}>Hiring analytics migrated from the legacy employer analytics workspace.</p>
      <LegacyFeatureTabs title="Analytics Sections" sections={sectionsWithLive} />
    </EmployerShell>
  );
};

export default Analytics;
