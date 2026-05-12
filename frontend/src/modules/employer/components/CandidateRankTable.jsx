import React from 'react';

const CandidateRankTable = ({ candidates = [] }) => {
  return (
    <section className="card" style={{ overflowX: 'auto' }}>
      <h3>AI Candidate Ranking</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Rank</th>
            <th style={{ textAlign: 'left' }}>Candidate</th>
            <th style={{ textAlign: 'left' }}>ATS</th>
            <th style={{ textAlign: 'left' }}>Semantic</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => (
            <tr key={candidate.application_id}>
              <td>{candidate.rank}</td>
              <td>{candidate.user_id}</td>
              <td>{candidate.ats_score}</td>
              <td>{candidate.semantic_score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default CandidateRankTable;



