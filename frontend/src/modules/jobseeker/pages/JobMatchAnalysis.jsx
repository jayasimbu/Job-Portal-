import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchRecommendations, applyForJob } from '../services/jobseekerService';
import { getCurrentUserId } from '../../../core/auth/session';
import { useToast } from '../../../core/context/ToastContext';
import { 
  Target, 
  Building2, 
  MapPin, 
  Briefcase, 
  Zap, 
  ShieldCheck, 
  XCircle, 
  Brain, 
  ArrowLeft,
  ChevronRight,
  Info,
  Clock,
  Sparkles
} from 'lucide-react';

// UI Components
import Button from '../../../components/ui/Button';
import Card, { CardBody, CardHeader } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { Heading, Text } from '../../../components/ui/Typography';
import { ATSCircle, SectionHeader, SkillChip } from '../components/DesignSystem';

const JobMatchAnalysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const userId = getCurrentUserId();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    const loadJobDetails = async () => {
      try {
        const data = await fetchRecommendations(userId);
        const found = data.recommendations?.find(j => j.id.toString() === id);
        if (found) {
          setJob(found);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadJobDetails();
  }, [id, userId]);

  const handleApply = async () => {
    try {
      setIsApplying(true);
      await applyForJob(userId, job.id);
      showToast(`Application sent to ${job.company}! 🚀`);
      setJob({ ...job, hasApplied: true });
    } catch (err) {
      showToast("Application failed ❌");
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
       <div className="size-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full " />
       <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Smart Comparison Active</p>
    </div>
  );

  if (!job) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
       <XCircle size={64} className="text-rose-500" />
       <Heading level={2}>Opportunity Not Found</Heading>
       <Button onClick={() => navigate('/platform/jobseeker/jobs')}>Return to Marketplace</Button>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 pb-20 px-8">
      {/* NAVIGATION & ACTIONS */}
      <div className="flex justify-between items-center">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Back to Search
        </Button>
        <div className="flex gap-4">
           <Badge variant="primary" className="bg-emerald-50 text-emerald-600 border-emerald-100 py-1.5 px-4">
              <Clock size={14} className="mr-2" />
              Closing in 3 days
           </Badge>
        </div>
      </div>

      {/* HEADER SECTION */}
      <header className="card-premium p-10 bg-slate-50 dark:bg-slate-900 border-none shadow-premium relative overflow-hidden group">
        <div className="absolute top-0 right-0 size-96 bg-blue-600/5 rounded-full blur-[100px] -mr-48 -mt-48 transition-all group-hover:bg-blue-600/10" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-10">
             <div className="size-28 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2.5rem] flex items-center justify-center font-black text-5xl text-blue-600 shadow-inner">
                {job.company?.[0]}
             </div>
             <div className="space-y-3 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3">
                   <Badge variant="slate" className="bg-slate-100 dark:bg-slate-800 border-none text-[10px]">FULL-TIME</Badge>
                   <Badge variant="primary" className="bg-blue-50 text-blue-600 border-none text-[10px]">AI MATCHED</Badge>
                </div>
                <h1 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white">{job.title}</h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                   <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                      <Building2 size={18} />
                      {job.company}
                   </div>
                   <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                      <MapPin size={18} />
                      {job.location}
                   </div>
                </div>
             </div>
          </div>
          
          <div className="flex flex-col items-center lg:items-end gap-6 shrink-0">
             <div className="flex items-center gap-4">
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Match Precision</p>
                   <p className="text-4xl font-black text-blue-600">{Math.round(job.match_score || 72)}%</p>
                </div>
                <ATSCircle value={job.match_score || 72} size={100} />
             </div>
             <Button 
               onClick={handleApply}
               disabled={job.hasApplied || isApplying}
               variant={job.hasApplied ? 'secondary' : 'gradient'}
               className="h-16 px-12 text-lg w-full md:w-auto"
             >
               {job.hasApplied ? 'Application Sent ✅' : isApplying ? 'Processing...' : (
                 <>
                   <Zap size={20} className="fill-white" />
                   One-Click Apply
                 </>
               )}
             </Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* LEFT SIDE: JOB DESCRIPTION */}
        <div className="lg:col-span-8 space-y-12">
           <section className="space-y-10">
              <SectionHeader title="Opportunity Blueprint" icon={Briefcase} color="blue" />
              
              <div className="space-y-12">
                 <div className="space-y-4">
                    <Text variant="small" className="font-black uppercase tracking-[0.2em] text-blue-600">The Mission</Text>
                    <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      {job.description || "As a Senior Developer, you will be responsible for architecting and implementing scalable solutions, mentoring junior engineers, and driving technical excellence across our platform."}
                    </p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                       <Text variant="small" className="font-black uppercase tracking-[0.2em] text-blue-600">Primary Responsibilities</Text>
                       <ul className="space-y-4">
                          {[
                            'Lead development of high-performance microservices',
                            'Collaborate with global product and design teams',
                            'Optimize application performance and scalability',
                            'Champion engineering best practices'
                          ].map(item => (
                            <li key={item} className="flex gap-4 text-slate-600 dark:text-slate-400 font-medium">
                               <div className="size-2 bg-blue-500 rounded-full mt-2 shrink-0" />
                               {item}
                            </li>
                          ))}
                       </ul>
                    </div>

                    <div className="space-y-6">
                       <Text variant="small" className="font-black uppercase tracking-[0.2em] text-blue-600">Growth Potential</Text>
                       <Card className="bg-slate-100 dark:bg-slate-800 border-none p-6">
                          <div className="space-y-4">
                             <div className="flex items-center gap-3 text-blue-600 font-bold">
                                <Sparkles size={20} />
                                High Impact Role
                             </div>
                             <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                This position report directly to the Head of Engineering and has a clear path to Technical Lead within 12 months.
                             </p>
                          </div>
                       </Card>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <Text variant="small" className="font-black uppercase tracking-[0.2em] text-blue-600">Technical Stack</Text>
                    <div className="flex flex-wrap gap-3">
                       {['React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'Kubernetes', 'CI/CD'].map(skill => (
                          <SkillChip key={skill} label={skill} variant="slate" />
                       ))}
                    </div>
                 </div>
              </div>
           </section>
        </div>

        {/* RIGHT SIDE: MATCH INTELLIGENCE */}
        <div className="lg:col-span-4 space-y-8">
           <section className="sticky top-8 space-y-8">
              {/* AI INSIGHT CARD */}
              <Card className="bg-slate-900 text-white border-none p-8 shadow-2xl relative overflow-hidden group">
                 <div className="absolute bottom-0 right-0 size-48 bg-blue-600/20 rounded-full blur-3xl -mr-24 -mb-24" />
                 <div className="relative z-10 space-y-8">
                    <div className="flex items-center justify-between">
                       <SectionHeader title="Match Strength" icon={Brain} color="blue" />
                       <Badge variant="primary" className="bg-blue-600 text-white border-none py-1 px-3">BETA</Badge>
                    </div>
                    
                    <div className="space-y-6">
                       <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Match Probability</span>
                          <span className="text-xl font-black text-blue-400">{Math.round(job.match_score || 72)}%</span>
                       </div>
                       <div className="h-3 w-full bg-slate-50/5 rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all " style={{ width: `${job.match_score || 72}%` }}></div>
                       </div>
                    </div>

                    <div className="p-6 bg-slate-50/5 rounded-2xl border border-white/5">
                       <p className="text-sm font-medium text-slate-300 leading-relaxed italic">
                         "Your profile demonstrates excellent command of {job.title.split(' ')[0]} patterns. The core match is strong, but emphasizing deployment automation would bridge the 12% gap in requirements."
                       </p>
                    </div>
                 </div>
              </Card>

              {/* SKILLS GAP COMPARISON */}
              <Card>
                 <CardHeader>
                    <Heading level={4}>Requirement Analysis</Heading>
                 </CardHeader>
                 <CardBody className="space-y-10">
                    <div className="space-y-4">
                       <div className="flex items-center gap-2 text-emerald-500">
                          <ShieldCheck size={18} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Matched Assets</span>
                       </div>
                       <div className="flex flex-wrap gap-2">
                          {['React', 'Node.js', 'PostgreSQL', 'JavaScript'].map(s => (
                             <SkillChip key={s} label={s} variant="success" />
                          ))}
                       </div>
                    </div>

                    <div className="space-y-4">
                       <div className="flex items-center gap-2 text-rose-500">
                          <XCircle size={18} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Growth Gaps</span>
                       </div>
                       <div className="flex flex-wrap gap-2">
                          {['Docker', 'AWS', 'Kubernetes'].map(s => (
                             <SkillChip key={s} label={s} variant="danger" />
                          ))}
                       </div>
                    </div>

                    <div className="pt-6 border-t border-slate-200 dark:border-slate-700 space-y-6">
                       <div className="flex items-center gap-2 text-blue-600">
                          <Sparkles size={18} />
                          <span className="text-[10px] font-black uppercase tracking-widest">AI Strategy</span>
                       </div>
                       <ul className="space-y-4">
                          {[
                             'Showcase deployment projects in your resume',
                             'Increase keyword density for backend optimization',
                             'Mention cloud-native exploration in your summary'
                          ].map((rec, i) => (
                             <li key={i} className="flex gap-3 text-xs font-bold text-slate-600 dark:text-slate-400">
                                <ChevronRight size={14} className="text-blue-500 shrink-0" />
                                {rec}
                             </li>
                          ))}
                       </ul>
                    </div>
                 </CardBody>
              </Card>

              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/50 p-8 text-center">
                 <div className="space-y-4">
                    <Info size={32} className="mx-auto text-blue-600" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Professional Tip</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                       Candidates who customize their summary based on AI match insights are 3.5x more likely to secure an initial interview.
                    </p>
                 </div>
              </Card>
           </section>
        </div>
      </div>
    </div>
  );
};

export default JobMatchAnalysis;



