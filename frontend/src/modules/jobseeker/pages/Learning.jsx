import React, { useEffect, useState } from 'react';
import JobSeekerShell from '../components/JobSeekerShell';
import LegacyFeatureTabs from '../../../core/components/LegacyFeatureTabs';
import { fetchLearningRecommendations } from '../services/jobseekerService';

const sections = [
  {
    key: 'courses',
    label: 'AI Courses',
    description: 'Training recommendations migrated from legacy learning module.',
    items: [
      'AI-driven course recommendations',
      'Candidate growth and learning insights',
      'External course and learning hub links',
    ],
  },
  {
    key: 'roadmap',
    label: 'Learning Roadmap',
    description: 'Skill-gap-based progression tracking connected to profile analytics.',
    items: ['Current gap priorities', 'Quarterly targets', 'Completed certifications timeline'],
  },
];

const Learning = () => {
  const [dynamicCourses, setDynamicCourses] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchLearningRecommendations(1);
        setDynamicCourses(response?.learning || []);
      } catch {
        setDynamicCourses([]);
      }
    };
    load();
  }, []);

  const tabSections = [
    ...sections,
    {
      key: 'live-learning',
      label: 'Live Learning Feed',
      description: 'Generated from backend learning recommendations and skill-gap logic.',
      items: dynamicCourses.map((course) => `${course.name}: ${course.reason}`),
    },
  ];

  return (
    <JobSeekerShell active="learning">
      <h1 style={{ fontSize: '34px', marginBottom: '6px' }}>Learning</h1>
      <p style={{ color: '#64748b', marginBottom: '16px' }}>Personalized upskilling driven by ATS and skill-gap analysis.</p>
      <LegacyFeatureTabs title="Learning Sections" sections={tabSections} />
    </JobSeekerShell>
  );
};

export default Learning;
