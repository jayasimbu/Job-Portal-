import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  FileText, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  Ban,
  Trash2,
  ExternalLink,
  ChevronLeft,
  TrendingUp // Added the missing import
} from 'lucide-react';
import Button from '../../../components/ui/Button';

// REALISTIC MOCK DATABASE
const USER_DB = {
  "101": {
    fullName: 'Jaya Simbu',
    email: 'jayasimbu.dev@linkup.com',
    phone: '+91 98765 43210',
    location: 'Chennai, TN',
    role: 'Job Seeker',
    verificationStatus: 'Verified',
    joinedDate: 'Oct 12, 2023',
    resumeScore: 92,
    college: 'Anna University',
    degree: 'B.E. Computer Science',
    experience: '2.5 Years',
    skills: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS', 'AWS'],
    missingSkills: ['Docker', 'Kubernetes'],
    preferredRole: 'Senior Frontend Developer',
    resumeDate: 'Jan 05, 2024',
    applications: [
      { id: 1, job: 'Lead React Developer', company: 'Zoho', status: 'Selected', date: '2 days ago' },
      { id: 2, job: 'UI Engineer', company: 'Freshworks', status: 'Pending', date: '5 days ago' }
    ]
  },
  "102": {
    fullName: 'Priya Mani',
    email: 'priya.ux@design.in',
    phone: '+91 88234 11223',
    location: 'Bangalore, KA',
    role: 'Job Seeker',
    verificationStatus: 'Verified',
    joinedDate: 'Nov 05, 2023',
    resumeScore: 85,
    college: 'NID Ahmedabad',
    degree: 'M.Des Interaction Design',
    experience: '4 Years',
    skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research', 'React'],
    missingSkills: ['Three.js', 'Blender'],
    preferredRole: 'Principal UX Designer',
    resumeDate: 'Feb 12, 2024',
    applications: [
      { id: 3, job: 'UX Architect', company: 'Cred', status: 'Selected', date: '1 week ago' },
      { id: 4, job: 'Product Designer', company: 'Razorpay', status: 'Rejected', date: '3 days ago' }
    ]
  },
  "103": {
    fullName: 'Arjun Reddy',
    email: 'arjun.backend@tech.com',
    phone: '+91 77665 44332',
    location: 'Hyderabad, TS',
    role: 'Job Seeker',
    verificationStatus: 'Pending',
    joinedDate: 'Jan 20, 2024',
    resumeScore: 78,
    college: 'IIT Hyderabad',
    degree: 'B.Tech IT',
    experience: '1.5 Years',
    skills: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Docker'],
    missingSkills: ['Go', 'Microservices'],
    preferredRole: 'Backend Engineer',
    resumeDate: 'Mar 01, 2024',
    applications: [
      { id: 5, job: 'SDE-1', company: 'Swiggy', status: 'Pending', date: '1 day ago' }
    ]
  },
  "104": {
    fullName: 'Kavya S',
    email: 'kavya.data@analyst.in',
    phone: '+91 99008 87766',
    location: 'Coimbatore, TN',
    role: 'Job Seeker',
    verificationStatus: 'Verified',
    joinedDate: 'Sep 15, 2023',
    resumeScore: 88,
    college: 'PSG Tech',
    degree: 'M.Sc Data Science',
    experience: '3 Years',
    skills: ['Python', 'SQL', 'Tableau', 'Scikit-Learn', 'Pandas'],
    missingSkills: ['PySpark', 'Deep Learning'],
    preferredRole: 'Data Scientist',
    resumeDate: 'Jan 28, 2024',
    applications: [
      { id: 6, job: 'Data Analyst', company: 'TCS', status: 'Selected', date: '1 month ago' }
    ]
  },
  "105": {
    fullName: 'Siddharth V',
    email: 'sid.devops@infra.com',
    phone: '+91 88776 65544',
    location: 'Pune, MH',
    role: 'Job Seeker',
    verificationStatus: 'Verified',
    joinedDate: 'Dec 01, 2023',
    resumeScore: 82,
    college: 'COEP Pune',
    degree: 'B.E. Mechanical',
    experience: '5 Years',
    skills: ['AWS', 'Kubernetes', 'Terraform', 'Jenkins', 'Ansible'],
    missingSkills: ['Azure', 'Python Automation'],
    preferredRole: 'DevOps Lead',
    resumeDate: 'Feb 15, 2024',
    applications: [
      { id: 7, job: 'Infrastructure Lead', company: 'Zomato', status: 'Pending', date: '2 weeks ago' }
    ]
  }
};

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Simulate API fetch with database lookup
    setTimeout(() => {
      // Fallback to ID 101 if specific ID not found for demo
      setUserData(USER_DB[id] || USER_DB["101"]);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-black">
      <div className="flex flex-col items-center gap-4">
        <div className="size-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
        <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Syncing Profile Data...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 px-6 pt-4">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/platform/admin/users')}
        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-bold text-xs uppercase tracking-widest"
      >
        <ChevronLeft size={16} /> Back to Users
      </button>

      {/* HEADER */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-[2.5rem] p-10 shadow-sm flex flex-col md:flex-row items-center gap-10">
        <div className="size-36 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-blue-500/20 shrink-0">
          {userData.fullName.charAt(0)}
        </div>
        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{userData.fullName}</h1>
            <span className={`w-fit mx-auto md:mx-0 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border flex items-center gap-1.5 ${
              userData.verificationStatus === 'Verified' 
              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800'
              : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800'
            }`}>
              <ShieldCheck size={14} /> {userData.verificationStatus}
            </span>
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs flex items-center justify-center md:justify-start gap-2">
            <Briefcase size={16} className="text-blue-500" /> {userData.role}
          </p>
          <div className="flex items-center justify-center md:justify-start gap-6 text-xs font-bold text-slate-400 mt-6">
            <span className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
               <Clock size={16} /> Joined {userData.joinedDate}
            </span>
            <span className="flex items-center gap-2 text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl border border-blue-100 dark:border-blue-800">
               <FileText size={16} /> Resume Score: {userData.resumeScore}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SECTION 1 — PERSONAL INFO */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-[2.5rem] p-8 shadow-sm space-y-8">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-5">Core Profile Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1.5">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Full Name</p>
              <p className="font-bold text-slate-900 dark:text-white">{userData.fullName}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Email Access</p>
              <p className="font-bold text-slate-900 dark:text-white underline underline-offset-4 decoration-blue-500/30">{userData.email}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact</p>
              <p className="font-bold text-slate-900 dark:text-white">{userData.phone}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Base Location</p>
              <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5"><MapPin size={14} className="text-slate-400" /> {userData.location}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Academic Info</p>
              <p className="font-bold text-slate-900 dark:text-white">{userData.college}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">{userData.degree}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Industry Experience</p>
              <p className="font-black text-blue-600 dark:text-blue-400 text-xl">{userData.experience}</p>
            </div>
          </div>
        </div>

        {/* SECTION 2 — RESUME DATA */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-[2.5rem] p-8 shadow-sm space-y-8">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-5">ATS AI Analysis</h2>
          <div className="space-y-8">
            <div className="flex items-center justify-between p-6 bg-slate-900 dark:bg-black rounded-3xl border border-slate-800">
              <div className="flex items-center gap-4">
                <div className="size-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ATS Efficiency Score</p>
                  <p className="text-3xl font-black text-white">{userData.resumeScore}%</p>
                </div>
              </div>
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">Updated: {userData.resumeDate}</p>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mastered Skills</p>
                <div className="flex flex-wrap gap-2">
                  {userData.skills.map(s => (
                    <span key={s} className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black rounded-lg uppercase tracking-wider border border-emerald-100 dark:border-emerald-800/30 flex items-center gap-1.5">
                       <ShieldCheck size={10} /> {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-rose-500">Critical Skill Gaps</p>
                <div className="flex flex-wrap gap-2">
                  {userData.missingSkills.map(s => (
                    <span key={s} className="px-3 py-1.5 bg-rose-50 dark:bg-rose-900/20 text-rose-500 text-[10px] font-black rounded-lg uppercase tracking-wider border border-rose-100 dark:border-rose-900/30 flex items-center gap-1.5">
                       <AlertCircle size={10} /> {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Recommended Role</p>
              <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-lg">{userData.preferredRole}</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3 — APPLICATION ACTIVITY */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-[2.5rem] p-8 shadow-sm space-y-8">
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-5">Application Intelligence</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 dark:border-slate-700">
                <th className="pb-6 px-4">Job Role</th>
                <th className="pb-6 px-4">Company Entity</th>
                <th className="pb-6 px-4">Submission Date</th>
                <th className="pb-6 px-4">Hiring Status</th>
                <th className="pb-6 px-4 text-right">Intelligence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {userData.applications.map(app => (
                <tr key={app.id} className="group hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all">
                  <td className="py-6 px-4 font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm">{app.job}</td>
                  <td className="py-6 px-4 text-sm font-bold text-slate-500 uppercase tracking-widest">{app.company}</td>
                  <td className="py-6 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">{app.date}</td>
                  <td className="py-6 px-4">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                      app.status === 'Selected' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      app.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                      'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="py-6 px-4 text-right">
                    <button className="size-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all border border-slate-200 dark:border-slate-700 mx-auto mr-0">
                      <ExternalLink size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 4 — ADMIN ACTIONS */}
      <div className="bg-slate-900 dark:bg-black rounded-[2.5rem] p-10 shadow-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-white text-xl font-black uppercase tracking-widest">Admin Control System</h3>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Authorized actions for profile management</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <Button variant="secondary" className="bg-slate-50/5 border-white/10 text-white hover:bg-slate-50/10 h-14 px-8 gap-3 text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95">
            <FileText size={18} /> View Cloud Resume
          </Button>
          <Button variant="secondary" className="border-amber-500/30 text-amber-500 hover:bg-amber-500/10 h-14 px-8 gap-3 text-xs font-black uppercase tracking-widest transition-all">
            <Ban size={18} /> Suspend Access
          </Button>
          <Button variant="danger" className="h-14 px-8 gap-3 text-xs font-black uppercase tracking-widest shadow-xl shadow-rose-500/20 transition-all hover:scale-105">
            <Trash2 size={18} /> Purge Account
          </Button>
        </div>
      </div>

    </div>
  );
}
