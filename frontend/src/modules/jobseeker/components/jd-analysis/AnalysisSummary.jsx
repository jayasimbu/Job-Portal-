import React from 'react';
import { PieChart, ListChecks, TrendingUp, AlertCircle } from 'lucide-react';

const AnalysisSummary = ({ matchResults }) => {
  const { matchedSkills, missingSkills, matchPercentage } = matchResults;

  const getSummaryText = () => {
    if (matchPercentage >= 80) {
      return "Excellent Match! Your profile closely aligns with the requirements. Focus on showcasing your experience with the matched skills.";
    } else if (matchPercentage >= 60) {
      return "Good Match. You have a solid foundation, but there are some key skill gaps you should address to improve your chances.";
    } else {
      return "Match Score is low. We recommend focusing on the missing skills listed below before applying to this role.";
    }
  };

  return (
    <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-300 p-6 h-full">
      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
        <PieChart className="size-5 text-indigo-600" />
        Analysis Summary
      </h3>

      <div className="space-y-6">
        <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
          <div className="flex gap-3">
            <TrendingUp className="size-5 text-indigo-600 shrink-0 mt-0.5" />
            <p className="text-sm text-indigo-900 font-medium leading-relaxed">
              {getSummaryText()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <ListChecks className="size-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Relevant Skills</span>
            </div>
            <p className="text-2xl font-black text-slate-800">{matchedSkills.length}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Identified in resume</p>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <AlertCircle className="size-4 text-rose-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Key Gaps</span>
            </div>
            <p className="text-2xl font-black text-slate-800">{missingSkills.length}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Required by employer</p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <p className="text-xs font-bold text-slate-500 uppercase mb-3 tracking-widest">Next Steps</p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm text-slate-600">
              <div className="size-1.5 rounded-full bg-indigo-400" />
              Update resume with keywords from JD
            </li>
            <li className="flex items-center gap-2 text-sm text-slate-600">
              <div className="size-1.5 rounded-full bg-indigo-400" />
              Complete a certification in {missingSkills[0] || 'Cloud Computing'}
            </li>
            <li className="flex items-center gap-2 text-sm text-slate-600">
              <div className="size-1.5 rounded-full bg-indigo-400" />
              Prepare interview answers for {matchedSkills[0] || 'Technical'} skills
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnalysisSummary;
