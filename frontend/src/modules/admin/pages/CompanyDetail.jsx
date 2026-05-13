import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Globe, 
  MapPin, 
  Users, 
  ShieldCheck, 
  Clock, 
  Briefcase, 
  BarChart3, 
  ExternalLink, 
  ChevronLeft,
  Mail,
  User,
  Ban,
  Trash2,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import Button from '../../../components/ui/Button';

// REALISTIC COMPANY DATABASE
const COMPANY_DB = {
  "1": {
    name: 'Real Time Projects',
    industry: 'Software Development',
    verificationStatus: 'Verified',
    companySize: '50-100 Employees',
    website: 'https://realtimeprojects.com',
    location: 'Bangalore, India',
    recruiterName: 'Sanjay Kumar',
    recruiterEmail: 'sanjay@realtimeprojects.com',
    hiringMode: 'Hybrid / Remote',
    activeJobs: 12,
    closedJobs: 45,
    applicationsReceived: 1240,
    hiringSuccessRate: 88,
    recentJobs: [
      { id: 1, title: 'Senior Backend Engineer', applications: 156, status: 'Active', date: 'Oct 10, 2023' },
      { id: 2, title: 'UI/UX Designer', applications: 89, status: 'Active', date: 'Oct 12, 2023' }
    ]
  },
  "2": {
    name: 'Zoho Corporation',
    industry: 'SaaS / Enterprise Software',
    verificationStatus: 'Verified',
    companySize: '10,000+ Employees',
    website: 'https://zoho.com',
    location: 'Chennai, India',
    recruiterName: 'Anitha R',
    recruiterEmail: 'anitha.hr@zohocorp.com',
    hiringMode: 'On-site / Office',
    activeJobs: 85,
    closedJobs: 1200,
    applicationsReceived: 25000,
    hiringSuccessRate: 94,
    recentJobs: [
      { id: 3, title: 'ZScript Developer', applications: 450, status: 'Active', date: 'Jan 20, 2024' },
      { id: 4, job: 'Sales Executive', applications: 890, status: 'Active', date: 'Jan 22, 2024' }
    ]
  },
  "3": {
    name: 'Freshworks',
    industry: 'Customer Engagement Software',
    verificationStatus: 'Verified',
    companySize: '5,000+ Employees',
    website: 'https://freshworks.com',
    location: 'Chennai / San Mateo',
    recruiterName: 'Manoj Kumar',
    recruiterEmail: 'manoj.k@freshworks.com',
    hiringMode: 'Hybrid',
    activeJobs: 32,
    closedJobs: 800,
    applicationsReceived: 15000,
    hiringSuccessRate: 91,
    recentJobs: [
      { id: 5, title: 'React Lead', applications: 230, status: 'Active', date: 'Feb 01, 2024' }
    ]
  },
  "4": {
    name: 'Razorpay',
    industry: 'Fintech / Payments',
    verificationStatus: 'Verified',
    companySize: '2,000+ Employees',
    website: 'https://razorpay.com',
    location: 'Bangalore, India',
    recruiterName: 'Deepak S',
    recruiterEmail: 'deepak.s@razorpay.com',
    hiringMode: 'Remote Friendly',
    activeJobs: 18,
    closedJobs: 450,
    applicationsReceived: 8000,
    hiringSuccessRate: 86,
    recentJobs: [
      { id: 6, title: 'Payments Engineer', applications: 310, status: 'Active', date: 'Feb 15, 2024' }
    ]
  },
  "5": {
    name: 'Zomato',
    industry: 'FoodTech / Logistics',
    verificationStatus: 'Verified',
    companySize: '5,000+ Employees',
    website: 'https://zomato.com',
    location: 'Gurgaon, India',
    recruiterName: 'Rahul Verma',
    recruiterEmail: 'rahul.v@zomato.com',
    hiringMode: 'On-site',
    activeJobs: 45,
    closedJobs: 1500,
    applicationsReceived: 45000,
    hiringSuccessRate: 82,
    recentJobs: [
      { id: 7, title: 'Logistics Manager', applications: 1200, status: 'Active', date: 'Mar 01, 2024' }
    ]
  }
};

export default function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [companyData, setCompanyData] = useState(null);

  useEffect(() => {
    // Simulate API fetch with database lookup
    setTimeout(() => {
      // Fallback to ID 1 if specific ID not found for demo
      setCompanyData(COMPANY_DB[id] || COMPANY_DB["1"]);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black">
      <div className="flex flex-col items-center gap-4">
        <div className="size-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
        <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Loading Company Analytics...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 px-6 pt-4">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/platform/admin/employers')}
        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-bold text-xs uppercase tracking-widest"
      >
        <ChevronLeft size={16} /> Back to Employers
      </button>

      {/* HEADER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-[2.5rem] p-10 shadow-sm flex flex-col md:flex-row items-center gap-10">
        <div className="size-36 bg-slate-100 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center text-blue-600 shadow-inner shrink-0">
          <Building2 size={64} />
        </div>
        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{companyData.name}</h1>
            <span className="w-fit mx-auto md:mx-0 px-4 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100 dark:border-emerald-800 flex items-center gap-1.5">
              <ShieldCheck size={14} /> {companyData.verificationStatus}
            </span>
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs flex items-center justify-center md:justify-start gap-2">
            <Briefcase size={16} className="text-blue-500" /> {companyData.industry}
          </p>
          <div className="flex items-center justify-center md:justify-start gap-6 text-xs font-bold text-slate-400 mt-6">
            <span className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
               <Users size={16} /> {companyData.companySize}
            </span>
            <a href={companyData.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl border border-blue-100 dark:border-blue-800 hover:scale-105 transition-transform">
               <Globe size={16} /> {companyData.website.replace('https://', '')}
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SECTION 1 — COMPANY INFO */}
        <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-[2.5rem] p-8 shadow-sm space-y-8">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-5">Operational Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1.5">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Official Domain</p>
              <p className="font-bold text-blue-600 dark:text-blue-400 underline underline-offset-4">{companyData.website}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Global Headquarters</p>
              <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2"><MapPin size={14} className="text-rose-500" /> {companyData.location}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Primary Contact Person</p>
              <div className="flex items-center gap-2">
                <User size={16} className="text-slate-400" />
                <p className="font-bold text-slate-900 dark:text-white">{companyData.recruiterName}</p>
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Communication Channel</p>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-slate-400" />
                <p className="font-bold text-slate-900 dark:text-white underline underline-offset-4 decoration-blue-500/20">{companyData.recruiterEmail}</p>
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Deployment Mode</p>
              <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{companyData.hiringMode}</p>
            </div>
          </div>
        </div>

        {/* SECTION 2 — JOB ACTIVITY */}
        <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-[2.5rem] p-8 shadow-sm space-y-8">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-5">Talent Acquisition Metrics</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Jobs</p>
              <p className="text-4xl font-black text-slate-900 dark:text-white">{companyData.activeJobs}</p>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Closed Cycles</p>
              <p className="text-4xl font-black text-slate-900 dark:text-white">{companyData.closedJobs}</p>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Candidates</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{companyData.applicationsReceived.toLocaleString()}</p>
            </div>
            <div className="p-6 bg-blue-600 rounded-3xl shadow-xl shadow-blue-500/20 space-y-1 text-white">
              <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest">Hiring Efficacy</p>
              <p className="text-4xl font-black">{companyData.hiringSuccessRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3 — RECENT JOB POSTS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-[2.5rem] p-8 shadow-sm space-y-8">
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-5">Recent Deployment Cycles</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 dark:border-slate-700">
                <th className="pb-6 px-4">Position Title</th>
                <th className="pb-6 px-4">Applicants</th>
                <th className="pb-6 px-4">Current Status</th>
                <th className="pb-6 px-4">Creation Date</th>
                <th className="pb-6 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {companyData.recentJobs.map(job => (
                <tr key={job.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                  <td className="py-6 px-4 font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm">{job.title}</td>
                  <td className="py-6 px-4">
                    <span className="text-sm font-black text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-lg border border-blue-100 dark:border-blue-800">{job.applications}</span>
                  </td>
                  <td className="py-6 px-4">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                      job.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-300'
                    }`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="py-6 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">{job.date}</td>
                  <td className="py-6 px-4 text-right">
                    <button className="size-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all border border-slate-200 dark:border-slate-700 ml-auto mr-0">
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
          <h3 className="text-white text-xl font-black uppercase tracking-widest">Employer Control System</h3>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Authorized administrative actions for company entity</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <Button variant="secondary" className="bg-emerald-600/10 border-emerald-600/20 text-emerald-500 hover:bg-emerald-600/20 h-14 px-8 gap-3 text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95">
            <CheckCircle size={18} /> Verify Entity
          </Button>
          <Button variant="secondary" className="border-amber-500/30 text-amber-500 hover:bg-amber-500/10 h-14 px-8 gap-3 text-xs font-black uppercase tracking-widest transition-all">
            <Ban size={18} /> Suspend Operations
          </Button>
          <Button variant="danger" className="h-14 px-8 gap-3 text-xs font-black uppercase tracking-widest shadow-xl shadow-rose-500/20 transition-all hover:scale-105">
            <Trash2 size={18} /> Terminate Account
          </Button>
        </div>
      </div>

    </div>
  );
}
