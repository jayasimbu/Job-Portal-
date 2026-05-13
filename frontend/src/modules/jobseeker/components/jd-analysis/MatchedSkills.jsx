import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const MatchedSkills = ({ skills }) => {
  return (
    <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-300 p-6 h-full">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <CheckCircle2 className="size-5 text-emerald-500" />
        Matched Skills
      </h3>
      
      {skills.length === 0 ? (
        <p className="text-sm text-slate-500 italic">No direct skill matches found.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, idx) => (
            <span 
              key={idx}
              className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-sm font-bold flex items-center gap-1.5"
            >
              <div className="size-1.5 rounded-full bg-emerald-500" />
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchedSkills;
