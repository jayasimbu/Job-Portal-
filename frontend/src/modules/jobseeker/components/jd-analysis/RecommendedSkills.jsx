import React from 'react';
import { Lightbulb, ArrowRight, ExternalLink } from 'lucide-react';
import skillsList from '../../data/skills_list.json';
import learningPaths from '../../data/learning_paths.json';

const RecommendedSkills = ({ matchedSkills }) => {
  // Logic to find related skills from the matched ones
  const getRecommendations = () => {
    const recommendations = [];
    matchedSkills.forEach(skill => {
      if (skillsList[skill]) {
        skillsList[skill].forEach(related => {
          if (!matchedSkills.includes(related)) {
            recommendations.push({ original: skill, recommended: related });
          }
        });
      }
    });
    return [...new Map(recommendations.map(item => [item.recommended, item])).values()].slice(0, 4);
  };

  const recommendations = getRecommendations();

  return (
    <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-300 p-6">
      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Lightbulb className="size-5 text-amber-500" />
        AI Learning Suggestions
      </h3>

      <div className="space-y-4">
        {recommendations.length === 0 ? (
          <div className="text-center py-8 bg-slate-100 rounded-xl border border-dashed border-slate-300">
            <p className="text-sm text-slate-500">Add more skills to get AI-powered learning suggestions.</p>
          </div>
        ) : (
          recommendations.map((item, idx) => {
            const path = learningPaths[item.recommended];
            return (
              <div key={idx} className="group p-4 bg-slate-100 hover:bg-indigo-50/50 border border-slate-300 hover:border-indigo-200 rounded-xl transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 bg-slate-200 text-slate-600 rounded">Because you know {item.original}</span>
                    <ArrowRight className="size-3 text-slate-400" />
                  </div>
                  <ExternalLink className="size-4 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{item.recommended}</p>
                    {path && (
                      <p className="text-xs text-slate-500 mt-1">{path.title}</p>
                    )}
                  </div>
                  <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Start Path</button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <button className="w-full mt-6 py-2.5 text-sm font-bold text-slate-600 hover:text-indigo-600 border border-slate-300 hover:border-indigo-200 rounded-xl transition-all">
        View All Recommendations
      </button>
    </div>
  );
};

export default RecommendedSkills;
