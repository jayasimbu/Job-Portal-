import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Briefcase, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Download, 
  Mail, 
  MessageSquare,
  ChevronLeft,
  XCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import Button from '../../../components/ui/Button';

// REALISTIC CANDIDATE DATABASE
const CANDIDATE_DB = {
  "1": {
    name: 'Arjun R',
    role: 'Frontend Developer',
    location: 'Chennai, India',
    matchScore: 94,
    availability: 'Immediate Joiner',
    summary: 'Highly proficient React developer with 2+ years of experience in building performance-optimized dashboards and complex state management systems.',
    objective: 'Seeking a challenging role as a Senior Frontend Engineer to build world-class user interfaces.',
    experience: '2 Years at Tech Mahindra',
    skills: ['React', 'TypeScript', 'Tailwind', 'Redux', 'Jest'],
    matchedSkills: ['React', 'Tailwind', 'TypeScript'],
    missingSkills: ['Storybook'],
    recommendation: 'Top-tier candidate for frontend roles. Strong technical alignment and clean code practices.',
    appliedDate: 'Oct 12, 2023'
  },
  "2": {
    name: 'Priya Mani',
    role: 'UI/UX Designer',
    location: 'Bangalore, India',
    matchScore: 92,
    availability: '2 Weeks Notice',
    summary: 'Creative UI/UX Designer specializing in design systems and user-centric web applications. Expert in Figma and prototyping.',
    objective: 'To lead design initiatives that bridge the gap between user needs and technical feasibility.',
    experience: '4 Years at Razorpay',
    skills: ['Figma', 'Prototyping', 'User Research', 'Design Systems', 'React'],
    matchedSkills: ['Figma', 'Design Systems', 'User Research'],
    missingSkills: ['Blender'],
    recommendation: 'Exceptional designer with a strong portfolio. Highly recommended for product-focused companies.',
    appliedDate: 'Oct 15, 2023'
  },
  "3": {
    name: 'Siddharth M',
    role: 'Backend Engineer',
    location: 'Hyderabad, India',
    matchScore: 79,
    availability: 'Immediate',
    summary: 'Backend specialist focused on Python/Django and scalable microservices. Experienced in AWS and Docker.',
    objective: 'To build robust backend infrastructures that handle millions of concurrent requests.',
    experience: '3 Years at Swiggy',
    skills: ['Python', 'Django', 'PostgreSQL', 'Docker', 'AWS', 'Redis'],
    matchedSkills: ['Python', 'Docker', 'AWS'],
    missingSkills: ['Kubernetes'],
    recommendation: 'Solid backend foundations. Good candidate for infrastructure or platform engineering teams.',
    appliedDate: 'Oct 18, 2023'
  },
  "4": {
    name: 'Rahul S',
    role: 'DevOps Engineer',
    location: 'Pune, India',
    matchScore: 88,
    availability: '1 Month Notice',
    summary: 'Infrastructure automation expert with a passion for CI/CD pipelines and cloud-native architecture.',
    objective: 'To streamline development workflows and ensure high system availability.',
    experience: '5 Years at Zomato',
    skills: ['AWS', 'Terraform', 'Kubernetes', 'Jenkins', 'Ansible', 'Go'],
    matchedSkills: ['AWS', 'Terraform', 'Kubernetes'],
    missingSkills: ['Azure'],
    recommendation: 'Experienced DevOps professional. Capable of leading infrastructure transformations.',
    appliedDate: 'Oct 20, 2023'
  },
  "5": {
    name: 'Karthik K',
    role: 'Frontend Developer',
    location: 'Chennai, India',
    matchScore: 65,
    availability: 'Immediate',
    summary: 'Junior frontend developer with a focus on modern CSS and JavaScript fundamentals.',
    objective: 'To grow my skills in a fast-paced environment and contribute to impactful projects.',
    experience: '1 Year (Internship) at TCS',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git'],
    matchedSkills: ['JavaScript', 'HTML'],
    missingSkills: ['TypeScript', 'Testing'],
    recommendation: 'High potential for growth. Best suited for roles with strong mentorship.',
    appliedDate: 'Oct 22, 2023'
  }
};

export default function CandidateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [candidate, setCandidate] = useState(null);

  useEffect(() => {
    // Simulate API fetch with database lookup
    setTimeout(() => {
      // Fallback to ID 1 if specific ID not found for demo
      setCandidate(CANDIDATE_DB[id] || CANDIDATE_DB["1"]);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-black">
      <div className="flex flex-col items-center gap-4">
        <div className="size-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
        <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Analyzing Candidate Match...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 px-6 pt-4">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/platform/employer/candidates')}
        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-bold text-xs uppercase tracking-widest"
      >
        <ChevronLeft size={16} /> Back to Pipeline
      </button>

      {/* HEADER */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-[2.5rem] p-10 shadow-sm flex flex-col md:flex-row items-center gap-10">
        <div className="size-36 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-blue-500/20 shrink-0">
          {candidate.name.charAt(0)}
        </div>
        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{candidate.name}</h1>
            <span className="w-fit mx-auto md:mx-0 px-4 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100 dark:border-blue-800 flex items-center gap-1.5">
               {candidate.availability}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-slate-500 font-bold uppercase tracking-widest text-[10px]">
            <span className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700"><Briefcase size={14} className="text-blue-500" /> {candidate.role}</span>
            <span className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700"><MapPin size={14} className="text-rose-500" /> {candidate.location}</span>
            <span className="flex items-center gap-2 text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-800"><Clock size={14} /> Applied {candidate.appliedDate}</span>
          </div>
        </div>
        
        {/* Match Circle */}
        <div className="flex flex-col items-center gap-1 bg-slate-900 dark:bg-black p-8 rounded-[2rem] border border-slate-800 shadow-2xl shrink-0">
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">ATS Accuracy</span>
           <span className="text-5xl font-black text-blue-500">{candidate.matchScore}%</span>
           <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] mt-1">High Potential</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* SECTION 1 — ABOUT */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-[2.5rem] p-8 shadow-sm space-y-8">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-5">Candidate Intelligence</h2>
            <div className="space-y-8">
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Professional Summary</p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-lg">{candidate.summary}</p>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Career Objective</p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{candidate.objective}</p>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Relevant Experience</p>
                <p className="text-slate-900 dark:text-white font-black text-xl uppercase tracking-tight">{candidate.experience}</p>
              </div>
            </div>
          </div>

          {/* SECTION 2 — SKILLS */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-[2.5rem] p-8 shadow-sm space-y-8">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-5">Skill Spectrum</h2>
            <div className="flex flex-wrap gap-3">
              {candidate.skills.map(skill => (
                <span key={skill} className="px-5 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest shadow-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* SECTION 4 — RESUME PREVIEW */}
          <div className="bg-slate-900 dark:bg-black border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl flex items-center justify-between gap-10">
            <div className="flex items-center gap-6">
               <div className="size-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                  <FileText size={32} />
               </div>
               <div>
                  <p className="text-lg font-black text-white uppercase tracking-tight">resume_{candidate.name.toLowerCase().replace(' ', '_')}.pdf</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cloud Verified Document • 1.8 MB</p>
               </div>
            </div>
            <div className="flex items-center gap-4">
               <Button variant="secondary" className="bg-slate-50/5 border-white/10 text-white h-12 px-6 gap-2 text-xs font-black uppercase tracking-widest transition-all hover:bg-slate-50/10">
                  <FileText size={16} /> View
               </Button>
               <Button variant="secondary" className="bg-slate-50/5 border-white/10 text-white h-12 px-6 gap-2 text-xs font-black uppercase tracking-widest transition-all hover:bg-slate-50/10">
                  <Download size={16} /> Download
               </Button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* SECTION 3 — ATS MATCH ANALYSIS */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-[2.5rem] p-8 shadow-sm space-y-8">
            <div className="flex items-center gap-3 text-blue-600">
               <Sparkles size={24} />
               <h2 className="text-xs font-black uppercase tracking-[0.3em]">ATS Match Analysis</h2>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Qualified Matches</p>
                <div className="flex flex-wrap gap-2">
                  {candidate.matchedSkills.map(s => (
                    <span key={s} className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black rounded-lg uppercase tracking-widest border border-emerald-100 dark:border-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 size={12} /> {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-rose-500">Technical Gaps</p>
                <div className="flex flex-wrap gap-2">
                  {candidate.missingSkills.map(s => (
                    <span key={s} className="px-3 py-1.5 bg-rose-50 dark:bg-rose-900/20 text-rose-500 text-[10px] font-black rounded-lg uppercase tracking-widest border border-rose-100 dark:border-rose-900/30 flex items-center gap-1.5">
                      <AlertCircle size={12} /> {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-slate-100 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Hiring Recommendation</p>
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed">{candidate.recommendation}</p>
              </div>
            </div>
          </div>

          {/* SECTION 5 — ACTIONS */}
          <div className="bg-slate-900 dark:bg-black border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl space-y-4">
            <Button className="w-full h-14 gap-3 text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95">
               <CheckCircle2 size={20} /> Shortlist Candidate
            </Button>
            <Button variant="secondary" className="w-full h-14 gap-3 text-white border-white/10 hover:bg-slate-50/5 text-xs font-black uppercase tracking-widest">
               <Mail size={18} /> Send Assessment
            </Button>
            <Button variant="secondary" className="w-full h-14 gap-3 text-white border-white/10 hover:bg-slate-50/5 text-xs font-black uppercase tracking-widest">
               <MessageSquare size={18} /> Schedule Interview
            </Button>
            <div className="pt-4 border-t border-slate-800">
              <Button variant="danger" className="w-full h-14 gap-3 text-xs font-black uppercase tracking-widest bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20 shadow-none">
                 <XCircle size={18} /> Reject Application
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
