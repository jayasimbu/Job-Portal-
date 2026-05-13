import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  ChevronRight, 
  TrendingUp, 
  Zap, 
  Brain, 
  Search, 
  CheckCircle2, 
  MoreVertical,
  Bookmark,
  Filter,
  BarChart3,
  ShieldCheck,
  EyeOff
} from 'lucide-react';

// UI Components
import Button from '../../../components/ui/Button';
import Card, { CardBody, CardHeader } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { Heading, Text } from '../../../components/ui/Typography';
import { ATSCircle, StatCard, SkillChip } from '../../jobseeker/components/DesignSystem';

export default function CandidateRanking() {
  const navigate = useNavigate();
  
  const candidates = [
    {
      id: 1,
      name: 'Sarah Jenkins',
      role: 'Senior UX Lead at TechFlow',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
      score: 98,
      scoreLabel: 'Elite Match',
      skills: ['Figma', 'Research', 'Prototyping'],
      match: 95,
      potentialStatus: 'High Potential',
      potentialColor: 'purple',
    },
    {
      id: 2,
      name: 'Marcus Chen',
      role: 'Product Designer at CreativeInc',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
      score: 92,
      scoreLabel: 'Strong Fit',
      skills: ['UI Design', 'Systems', 'Motion'],
      match: 88,
      potentialStatus: 'Steady Growth',
      potentialColor: 'blue',
    },
    {
      id: 3,
      name: 'Elena Rodriguez',
      role: 'Freelance UI Designer',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop',
      score: 85,
      scoreLabel: 'Good Fit',
      skills: ['Visual Design', 'Branding', 'Webflow'],
      match: 82,
      potentialStatus: 'Emerging',
      potentialColor: 'emerald',
    },
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-12 pb-20 px-8 duration-1000">
      {/* NAVIGATION */}
      <div className="flex justify-between items-center">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Back to Listings
        </Button>
        <div className="flex gap-4">
           <Badge variant="primary" className="bg-blue-50 text-blue-600 border-none px-4 py-1.5">
              Ref ID: #SPD-2024
           </Badge>
        </div>
      </div>

      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-blue-600">
             <BarChart3 size={18} />
             <span className="text-xs font-black uppercase tracking-[0.2em]">Candidate Ranking</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
            Senior Product Designer
          </h1>
          <p className="text-slate-500 font-medium text-lg">Comparing 142 applicants against your core requirements.</p>
        </div>
        <div className="flex gap-4">
           <Button variant="secondary" className="h-14 px-8">
              Edit Criteria
           </Button>
           <Button variant="gradient" className="h-14 px-8 shadow-xl shadow-blue-600/20">
              <Plus size={20} />
              Add Candidate
           </Button>
        </div>
      </header>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard label="Total Applicants" value="142" icon={Users} trend="+12% wk" color="blue" />
        <StatCard label="Elite Matches" value="12" icon={Target} trend="+2 new" color="emerald" />
        <StatCard label="Mean Fit Score" value="78%" icon={Brain} trend="Top 5% market" color="indigo" />
      </div>

      {/* CONTROLS */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 p-4 bg-slate-100/50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-700">
        <div className="flex gap-3 flex-wrap">
           <Button className="h-11 px-5 rounded-xl bg-blue-600 text-white border-none text-xs">
              <Zap size={16} />
              Top 10% Match Strength
           </Button>
           <Button variant="secondary" className="h-11 px-5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800">
              <ShieldCheck size={16} />
              Diversity Matches
           </Button>
           <Button variant="secondary" className="h-11 px-5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800">
              <EyeOff size={16} />
              Bias-Free Mode
           </Button>
        </div>
        <div className="flex items-center gap-4">
           <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Sort:</span>
           <select className="h-11 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/10 cursor-pointer">
              <option>Highest Match Precision</option>
              <option>Growth Potential</option>
              <option>Latest Applications</option>
           </select>
        </div>
      </div>

      {/* CANDIDATE LIST */}
      <div className="space-y-6">
        {candidates.map((cand) => (
          <Card 
            key={cand.id} 
            className="group hover:border-blue-500/50 transition-all cursor-pointer relative overflow-hidden"
            onClick={() => navigate(`/platform/employer/candidates/${cand.id}`)}
          >
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 items-center p-8">
              {/* Identity */}
              <div className="lg:col-span-4 flex items-center gap-6 w-full">
                <div className="relative shrink-0">
                  <div 
                    className="size-20 bg-center bg-cover rounded-[1.5rem] border-4 border-white dark:border-slate-700 shadow-xl group-hover:scale-105 transition-all"
                    style={{ backgroundImage: `url(${cand.image})` }}
                  ></div>
                  {cand.score > 95 && (
                    <div className="absolute -bottom-2 -right-2 bg-slate-50 dark:bg-slate-900 rounded-full p-1 shadow-lg border border-slate-200 dark:border-slate-700">
                      <CheckCircle2 size={24} className="text-blue-600 fill-blue-50" />
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 transition-colors">
                    {cand.name}
                  </h3>
                  <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
                    <Briefcase size={14} />
                    {cand.role}
                  </p>
                </div>
              </div>

              {/* Neural Score */}
              <div className="lg:col-span-2 flex items-center gap-5 w-full">
                <ATSCircle value={cand.score} size={64} />
                <div className="flex flex-col">
                   <span className="text-xs font-black text-blue-600 uppercase tracking-widest">{cand.scoreLabel}</span>
                   <span className="text-[10px] font-bold text-slate-400">98% Data Confidence</span>
                </div>
              </div>

              {/* Skill Match */}
              <div className="lg:col-span-3 w-full space-y-3">
                 <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Skill Resonance</span>
                    <span className="text-xs font-black text-slate-900 dark:text-white">{cand.match}%</span>
                 </div>
                 <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full" style={{ width: `${cand.match}%` }}></div>
                 </div>
                 <div className="flex flex-wrap gap-2">
                    {cand.skills.map(s => (
                       <SkillChip key={s} label={s} variant="slate" />
                    ))}
                 </div>
              </div>

              {/* Potential */}
              <div className="lg:col-span-2 flex items-center gap-4 w-full">
                 <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                   cand.potentialColor === 'purple' ? 'bg-purple-50 text-purple-600' :
                   cand.potentialColor === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                 }`}>
                    <TrendingUp size={24} />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-900 dark:text-white leading-tight">{cand.potentialStatus}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Career Trajectory</span>
                 </div>
              </div>

              {/* Actions */}
              <div className="lg:col-span-1 flex items-center justify-end gap-3 w-full">
                 <Button variant="secondary" className="size-11 p-0 rounded-xl hover:text-blue-600 hover:bg-blue-50">
                    <Bookmark size={18} />
                 </Button>
                 <Button variant="secondary" className="size-11 p-0 rounded-xl">
                    <MoreVertical size={18} />
                 </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* FOOTER */}
      <div className="flex justify-center pt-8">
        <Button variant="secondary" className="h-14 px-10 rounded-2xl bg-slate-50 dark:bg-slate-900">
           Scan 139 More Candidates
           <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  );
}



