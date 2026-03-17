import React, { useEffect, useState } from 'react';
import JobSeekerShell from '../components/JobSeekerShell';
import LegacyFeatureTabs from '../../../core/components/LegacyFeatureTabs';
import { fetchInsights } from '../services/jobseekerService';

const sections = [
  {
    key: 'recommendations',
    label: 'Recommendations',
    description: 'Migrated from legacy AI recommendation and match screens.',
    items: [
      'AI job recommendations and match insights',
      'AI match reasoning and explanation details',
      'Recommendation history timeline',
      'Job details and match breakdown',
    ],
  },
  {
    key: 'explanations',
    label: 'Scoring Logic',
    description: 'Explains recommendation confidence and relevance factors.',
    items: ['Skill alignment score', 'Experience and industry fit', 'Role relevance and trend signal'],
  },
];

const Insights = () => {
  const [dynamicInsights, setDynamicInsights] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchInsights(1);
        setDynamicInsights(response?.insights || []);
      } catch {
        setDynamicInsights([]);
      }
    };
    load();
  }, []);

  const tabSections = [
    ...sections,
    {
      key: 'live-insights',
      label: 'Live Insights',
      description: 'Generated from backend profile, resume, and application signals.',
      items: dynamicInsights.map((insight) => `${insight.title}: ${insight.description}`),
    },
  ];

  return (
    <JobSeekerShell active="insights">
      <h1 style={{ fontSize: '34px', marginBottom: '6px' }}>Insights</h1>
      <p style={{ color: '#64748b', marginBottom: '16px' }}>AI explanation layer for recommendation confidence and match quality.</p>
      <LegacyFeatureTabs title="Insight Sections" sections={tabSections} />
    </JobSeekerShell>
  );
};

export default Insights;
