import React from 'react';

export const Card = ({ children, className = '', ...props }) => (
  <div 
    className={`bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm transition-all overflow-hidden ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-slate-50 dark:border-slate-700 flex items-center justify-between ${className}`}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-t border-slate-50 dark:border-slate-700 bg-slate-100/30 dark:bg-slate-800/30 ${className}`}>
    {children}
  </div>
);

export const MetricCard = ({ icon: Icon, label, value, trend, color = 'blue' }) => {
  const colorMap = {
    blue: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
    purple: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
    emerald: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20',
    rose: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20',
    amber: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
  };

  return (
    <Card className="p-6 space-y-4 group hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div className={`size-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${colorMap[color]}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-lg ${trend.startsWith('+') ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-rose-600 bg-rose-50 dark:bg-rose-900/20'}`}>
            {trend}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</p>
      </div>
    </Card>
  );
};

export const InsightCard = ({ title, description, icon: Icon, actionLabel, onAction }) => (
  <Card className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none shadow-xl shadow-blue-600/20 relative overflow-hidden group">
    <div className="absolute top-0 right-0 size-32 bg-slate-50/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-slate-50/20 transition-all" />
    <div className="relative z-10 space-y-6">
      <div className="size-12 bg-slate-50/20 backdrop-blur-md rounded-xl flex items-center justify-center">
        <Icon size={24} />
      </div>
      <div className="space-y-2">
        <h4 className="text-xl font-bold tracking-tight">{title}</h4>
        <p className="text-blue-100 text-sm leading-relaxed">{description}</p>
      </div>
      {actionLabel && (
        <button 
          onClick={onAction}
          className="w-full py-3 bg-slate-50 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-50 transition-all active:scale-95 shadow-lg"
        >
          {actionLabel}
        </button>
      )}
    </div>
  </Card>
);

export const DashboardCard = ({ title, subtitle, children, icon: Icon, action }) => (
  <Card className="flex flex-col h-full">
    <CardHeader className="flex-shrink-0">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="size-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-blue-600">
            <Icon size={18} />
          </div>
        )}
        <div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-none">{title}</h4>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
      </div>
      {action}
    </CardHeader>
    <CardBody className="flex-1">
      {children}
    </CardBody>
  </Card>
);

export default Card;



