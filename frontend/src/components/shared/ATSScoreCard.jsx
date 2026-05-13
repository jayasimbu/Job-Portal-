import React from 'react';

const ATSScoreCard = ({ score, breakdown = {} }) => {
  const getScoreColor = (val) => {
    if (val >= 80) return 'text-success';
    if (val >= 60) return 'text-warning';
    return 'text-danger';
  };

  const getProgressColor = (val) => {
    if (val >= 80) return 'bg-success';
    if (val >= 60) return 'bg-warning';
    return 'bg-danger';
  };

  return (
    <div className="card-premium p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="heading-md">ATS Analysis</h3>
        <div className={`text-4xl font-extrabold tracking-tight-extreme ${getScoreColor(score)}`}>
          {score}%
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(breakdown).map(([key, val]) => (
          <div key={key} className="space-y-1.5">
            <div className="flex justify-between text-sm font-semibold">
              <span className="capitalize text-gray-600">{key}</span>
              <span className={getScoreColor(val)}>{val}%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${getProgressColor(val)}`}
                style={{ width: `${val}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      
      {score < 70 && (
        <div className="mt-6 p-4 bg-danger/5 border border-danger/10 rounded-xl">
          <p className="body-sm text-danger font-medium text-center">
            Low ATS Score detected. Optimize your resume for better visibility.
          </p>
        </div>
      )}
    </div>
  );
};

export default ATSScoreCard;
