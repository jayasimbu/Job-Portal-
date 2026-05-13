import React from 'react';

const StatCard = ({ title, value, icon: Icon, trend, trendType = 'neutral' }) => {
  const trendColor = {
    positive: 'text-success bg-success/10',
    negative: 'text-danger bg-danger/10',
    neutral: 'text-gray-400 bg-gray-100'
  }[trendType];

  return (
    <div className="card-premium p-6 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="p-3 bg-blue-50 rounded-2xl">
          {Icon && <Icon className="w-6 h-6 text-primary" />}
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-lg ${trendColor}`}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="caption mb-1">{title}</p>
        <h3 className="heading-lg text-dark">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;
