import React from 'react';

const RoleSelection = ({ onSelect }) => {
  const roles = [
    {
      id: 'jobseeker',
      title: "I'm a Job Seeker",
      description: "Find your dream job with AI-powered matching and resume optimization.",
      icon: <span className="material-symbols-outlined text-4xl">person</span>,
      color: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-100 dark:border-blue-800",
      hoverBorder: "hover:border-blue-500",
      iconColor: "text-blue-600",
    },
    {
      id: 'employer',
      title: "I'm an Employer",
      description: "Find the perfect candidates faster with AI verification and ATS scoring.",
      icon: <span className="material-symbols-outlined text-4xl">domain</span>,
      color: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-100 dark:border-purple-800",
      hoverBorder: "hover:border-purple-500",
      iconColor: "text-purple-600",
    }
  ];

  return (
    <div className="flex flex-col gap-5 w-full max-w-md mx-auto">
      {/* Removed Redundant Header Block */}

      {roles.map((role) => (
        <button
          key={role.id}
          onClick={() => onSelect(role.id)}
          className={`flex items-center gap-4 p-4 transition-all duration-300 rounded-2xl border-2 ${role.borderColor} ${role.hoverBorder} text-left group bg-white dark:bg-[#1a2632] shadow-sm hover:shadow-[0_15px_40px_rgba(37,99,235,0.08)] hover:scale-[1.02] active:scale-[0.98] outline-none focus:ring-4 focus:ring-blue-500/10`}
        >
          <div className={`size-12 rounded-xl ${role.color} ${role.iconColor} transition-transform group-hover:scale-110 flex items-center justify-center shrink-0`}>
            {role.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-0.5 group-hover:text-blue-600 transition-colors">
              {role.title}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed opacity-80">
              {role.description}
            </p>
          </div>
          <span className="material-symbols-outlined text-slate-300 dark:text-slate-700 group-hover:text-blue-500 transition-all translate-x-0 group-hover:translate-x-1">chevron_right</span>
        </button>
      ))}
      
      <div className="mt-2 text-center">
        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">
          Already have an account?{' '}
          <button 
            onClick={() => onSelect('login')}
            className="text-blue-600 font-black hover:underline underline-offset-4 decoration-2 transition-all"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default RoleSelection;
