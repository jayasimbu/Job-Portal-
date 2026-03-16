import React from 'react';

const ResumeInsightsCard = ({ score = 0, skills = [], recommendations = [] }) => {
  return (
    <section className="card">
      <h3>AI Resume Insights</h3>
      <p><strong>ATS Score:</strong> {score}/100</p>
      <p><strong>Top Skills:</strong> {skills.join(', ') || 'No skills detected yet'}</p>
      <p><strong>Suggestions:</strong> {recommendations.join(' | ') || 'Upload resume for recommendations'}</p>
    </section>
  );
};

export default ResumeInsightsCard;
