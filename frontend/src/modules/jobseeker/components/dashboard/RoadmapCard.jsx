import React from 'react';
import { Compass, Map } from 'lucide-react';

const RoadmapCard = ({ onOpenRoadmap }) => {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-[12px] p-6 shadow-xl relative overflow-hidden group">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4 text-blue-400">
          <Compass size={18} className="group-hover:rotate-45 transition-transform " />
          <h3 className="text-sm font-black uppercase tracking-tight text-white">Learning Roadmap</h3>
        </div>
        <p className="text-xs font-bold text-slate-300 leading-relaxed mb-6">
          A personalized career acceleration path generated based on your unique skill profile and market demand.
        </p>
        <button 
          onClick={onOpenRoadmap}
          className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all backdrop-blur-sm active:scale-95 flex items-center justify-center gap-2"
        >
          <Map size={14} />
          Open Full Roadmap
        </button>
      </div>

      {/* Decorative Graphics */}
      <div className="absolute -bottom-4 -right-4 size-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all "></div>
      <div className="absolute top-0 right-0 p-4 opacity-10">
         <Compass size={80} className="text-white" />
      </div>
    </div>
  );
};

export default RoadmapCard;



