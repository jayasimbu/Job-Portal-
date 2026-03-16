import React from 'react';

const MetricTile = ({ label, value }) => {
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f5f8b' }}>{value}</p>
      <p>{label}</p>
    </div>
  );
};

export default MetricTile;
