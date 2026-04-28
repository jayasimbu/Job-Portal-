import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const defaultStats = [
  { label: 'Total Applicants', value: '1,240', change: '+12%', isPositive: true, icon: 'group', iconBg: 'bg-blue-50 dark:bg-blue-900/20', iconColor: 'text-blue-600 dark:text-blue-400', spark: 'M0,15 L5,10 L10,12 L15,5 L20,8 L25,0', link: '/platform/employer/candidates' },
  { label: 'Active Jobs', value: '18', change: '-2%', isPositive: false, icon: 'work', iconBg: 'bg-purple-50 dark:bg-purple-900/20', iconColor: 'text-purple-600 dark:text-purple-400', spark: 'M0,2 L5,8 L10,5 L15,12 L20,10 L25,18', link: '/platform/employer/jobs' },
  { label: 'Interviews', value: '120', change: '+5%', isPositive: true, icon: 'calendar_month', iconBg: 'bg-orange-50 dark:bg-orange-900/20', iconColor: 'text-orange-600 dark:text-orange-400', spark: 'M0,20 L5,15 L10,15 L15,8 L20,10 L25,5', link: '/platform/employer/interviews' },
  { label: 'Hires Made', value: '12', change: '-8%', isPositive: false, icon: 'handshake', iconBg: 'bg-teal-50 dark:bg-teal-900/20', iconColor: 'text-teal-600 dark:text-teal-400', spark: 'M0,5 L5,10 L10,8 L15,15 L20,12 L25,20', link: '/platform/employer/candidates' },
];

const funnelSteps = [
  { label: 'Applied', count: '1,240', dropoff: null, width: '100%', color: 'bg-slate-200 dark:bg-slate-700' },
  { label: 'Screened', count: '850', dropoff: '68% conversion (32% drop)', reason: 'Missing core skills in resumes', width: '68%', color: 'bg-purple-300 dark:bg-purple-900/50' },
  { label: 'Interview', count: '120', dropoff: '14% conversion (86% drop)', reason: 'Low technical assessment scores', width: '35%', color: 'bg-purple-500' },
  { label: 'Offer', count: '15', dropoff: '12% conversion', width: '20%', color: 'bg-purple-600' },
  { label: 'Hired', count: '12', dropoff: '80% acceptance', width: '10%', color: 'bg-teal-500' },
];

const departments = [
  { label: 'Eng', days: 12, height: '40%', color: 'bg-purple-600' },
  { label: 'Prod', days: 15, height: '50%', color: 'bg-purple-500' },
  { label: 'Sales', days: 8, height: '25%', color: 'bg-teal-500' },
  { label: 'Mktg', days: 10, height: '33%', color: 'bg-blue-500' },
  { label: 'HR', days: 18, height: '60%', color: 'bg-orange-400' },
  { label: 'Design', days: 9, height: '30%', color: 'bg-pink-500' },
];

const channels = [
  { label: 'LinkedIn', pct: '45%', quality: 'High', color: '#8b5cf6' }, 
  { label: 'Referral', pct: '25%', quality: 'High', color: '#14b8a6' }, 
  { label: 'Direct', pct: '20%', quality: 'Medium', color: '#3b82f6' },   
  { label: 'Agency', pct: '10%', quality: 'Low', color: '#f97316' },   
];

export default function Analytics() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(defaultStats);
  const [showExport, setShowExport] = useState(false);
  const [toast, setToast] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    async function fetchAnalyticsData() {
      // Mock data logic remains the same
    }
    fetchAnalyticsData();
  }, []);

  const handleExport = (type) => {
    setShowExport(false);
    setToast(`Generating ${type}...`);
    setTimeout(() => {
      setToast('✔ Export successful');
      setTimeout(() => setToast(null), 3000);
    }, 1500);
  };

  const handleDateChange = (e) => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleNav = (link) => {
    setIsNavigating(true);
    setTimeout(() => navigate(link), 600);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      
      {/* Toast Notification */}
      {toast && (
        <div className="absolute top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          {toast.includes('Generating') ? (
            <span className="material-symbols-outlined animate-spin text-purple-400">sync</span>
          ) : (
            <span className="material-symbols-outlined text-green-400">check_circle</span>
          )}
          <span className="text-sm font-bold tracking-wide">{toast}</span>
        </div>
      )}

      {/* Full Page Loading Overlay (simulating nav skeleton) */}
      {isNavigating && (
        <div className="absolute inset-0 z-50 bg-slate-50/80 dark:bg-[#0d141b]/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in">
          <div className="flex flex-col items-center gap-4">
            <span className="material-symbols-outlined animate-spin text-purple-600 text-4xl">sync</span>
            <span className="text-sm font-black uppercase tracking-widest text-slate-500">Loading module...</span>
          </div>
        </div>
      )}

      {/* Page Heading & Filters */}
      <div className="flex-shrink-0 flex flex-wrap justify-between items-end gap-4 mb-6">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Hiring Analytics</h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Track your hiring performance and identify key metrics.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            onChange={handleDateChange}
            className="text-sm font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 hover:border-purple-400 cursor-pointer shadow-sm transition-all"
          >
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 3 months</option>
            <option>Custom Range</option>
          </select>
          
          <div className="relative">
            <button 
              onClick={() => setShowExport(!showExport)} 
              className="flex items-center gap-2 text-sm font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:border-purple-400 hover:text-purple-600 transition-all shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export
              <span className="material-symbols-outlined text-[18px]">expand_more</span>
            </button>
            {showExport && (
              <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                {['PDF Report', 'CSV Data', 'Excel Sheet'].map(type => (
                  <button key={type} onClick={() => handleExport(type)} className="w-full text-left px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between group">
                    {type}
                    <span className="material-symbols-outlined text-[14px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main scrollable content */}
      <div className={`flex-1 overflow-y-auto custom-scrollbar pr-1 pb-4 min-h-0 space-y-6 ${isRefreshing ? 'opacity-50 blur-sm pointer-events-none transition-all duration-300' : 'opacity-100 blur-0 transition-all duration-500'}`}>
        
        {/* AI Insight Box (STATE-DRIVEN) */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-5 text-white shadow-lg shadow-purple-500/20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-white/20 transition-all duration-700"></div>
          
          <div className="flex items-start gap-4 relative z-10 flex-1">
            <div className="size-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0 backdrop-blur-sm shadow-inner mt-1">
              <span className="material-symbols-outlined text-2xl animate-pulse">auto_awesome</span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-black text-lg tracking-tight mb-1 text-white flex items-center gap-2">
                Conversion dropped by <span className="bg-red-500/80 px-2 py-0.5 rounded text-white shadow-sm">12%</span> this week.
              </h3>
              <p className="text-sm font-medium text-purple-100">
                <span className="font-bold text-white bg-white/20 px-1.5 py-0.5 rounded mr-1">Reason:</span> 
                Low interview-to-offer ratio due to missing core technical skills.
              </p>
            </div>
          </div>
          
          <div className="relative z-10 flex flex-wrap lg:flex-nowrap gap-3 shrink-0 w-full lg:w-auto">
            <button onClick={() => handleNav('/platform/employer/jobs')} className="flex-1 lg:flex-none text-center bg-white/10 border border-white/20 text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-white/20 transition-all active:scale-95">
              Review Pipeline
            </button>
            <button onClick={() => handleNav('/platform/employer/candidates')} className="flex-1 lg:flex-none text-center bg-white text-purple-700 text-xs font-black uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-purple-50 hover:shadow-lg transition-all active:scale-95">
              View Candidate Quality
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div 
              key={stat.label} 
              onClick={() => handleNav(stat.link)}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-purple-400 hover:shadow-md transition-all group cursor-pointer relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 ${stat.iconBg} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                  <span className={`material-symbols-outlined ${stat.iconColor}`}>{stat.icon}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`flex items-center px-2 py-0.5 rounded-md text-xs font-black ${stat.isPositive ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' : 'text-red-600 bg-red-50 dark:bg-red-900/30'}`}>
                    {stat.change}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider">vs last 30d</span>
                </div>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
              <div className="flex items-end justify-between mt-1">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">{stat.value}</h3>
                
                {/* Mini Sparkline with Tooltip */}
                <div className="relative group/spark">
                  <svg width="40" height="25" viewBox="0 0 25 25" className={`opacity-40 group-hover:opacity-100 transition-opacity ${stat.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                    <path d={stat.spark} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {/* Tooltip */}
                  <div className="absolute -top-8 right-0 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover/spark:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg pointer-events-none">
                    {stat.isPositive ? 'Upward Trend' : 'Downward Trend'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid - First Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recruitment Funnel (2 cols) */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col group/funnel">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Recruitment Pipeline Funnel</h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">True drop-off visualization</p>
              </div>
              <button className="text-slate-400 hover:text-purple-600 transition-colors bg-slate-50 dark:bg-slate-800 p-2 rounded-lg" title="View Details">
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </button>
            </div>
            
            <div className="flex-1 flex flex-col justify-center gap-4 pb-4 pt-2">
              {funnelSteps.map((step, i) => (
                <div key={step.label} className="relative group cursor-pointer">
                  <div className="flex justify-between items-end mb-1 px-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 group-hover:text-purple-600 transition-colors">{step.label}</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">{step.count}</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-10 relative overflow-hidden flex items-center">
                      <div 
                        className={`h-full ${step.color} rounded-lg transition-all duration-1000 ease-out flex items-center justify-end px-4 group-hover:brightness-110 shadow-inner`} 
                        style={{ width: step.width, margin: '0 auto' }}
                      >
                        {i === 2 && <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />}
                      </div>
                    </div>
                    
                    {step.dropoff && (
                      <div className="w-40 flex flex-col items-start">
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-tight">
                          ↳ {step.dropoff.split(' (')[1]?.replace(')', '') || step.dropoff}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 leading-tight">
                          {step.reason}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Diversity & Bias Card (1 col) */}
          <div className="bg-slate-900 text-white rounded-3xl shadow-xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/20 blur-3xl rounded-full -mr-10 -mt-10 group-hover:bg-purple-500/30 transition-colors"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/20 blur-3xl rounded-full -ml-10 -mb-10"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-1">
                <span className="material-symbols-outlined text-teal-400">diversity_3</span>
                <h3 className="text-lg font-black uppercase tracking-tight">Diversity & Bias</h3>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-teal-400/80 mb-4 bg-teal-400/10 self-start px-2 py-0.5 rounded">Based on 1,240 candidates</span>
              
              <p className="text-xs font-medium text-slate-400 mb-6 leading-relaxed">
                Balanced gender distribution improves hiring fairness and team performance.
              </p>
              
              <div className="space-y-6 flex-1">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-300">Candidate Pool Balance</span>
                    <span className="text-teal-400 uppercase tracking-widest">Good</span>
                  </div>
                  <div className="flex h-4 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-white/20 transition-all">
                    <div className="bg-teal-500 w-[48%] group-hover:opacity-90 transition-opacity" title="Female (48%)"></div>
                    <div className="bg-purple-500 w-[52%] group-hover:opacity-90 transition-opacity" title="Male (52%)"></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mt-2 text-slate-400">
                    <span>48% Female</span>
                    <span>52% Male</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-300">Blind Screening Efficiency</span>
                    <span className="text-white">94%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-teal-400 h-2 rounded-full shadow-[0_0_10px_rgba(45,212,191,0.5)]" style={{ width: '94%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-5 border-t border-white/10">
                <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95">
                  View Full Diversity Report
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Charts Grid - Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Time to Hire Bar Chart (2 cols) */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col group relative">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Time to Hire by Department</h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Average days from application to offer</p>
              </div>
              <button className="text-slate-400 hover:text-purple-600 transition-colors bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
                <span className="material-symbols-outlined text-sm">bar_chart</span>
              </button>
            </div>
            
            <div className="h-56 flex items-end justify-around gap-2 pt-4 border-b border-slate-100 dark:border-slate-800 pb-2 relative">
              
              {/* Benchmark / Target Line */}
              <div className="absolute top-[30%] left-0 w-full border-t-2 border-dashed border-emerald-400/50 z-0">
                <div className="absolute -top-3 left-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 uppercase tracking-widest">Target: 10 Days</div>
              </div>

              {departments.map((dept) => (
                <div key={dept.label} className="flex flex-col items-center flex-1 relative group/bar cursor-pointer z-10">
                  {/* Hover tooltip value */}
                  <div className={`absolute -top-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap shadow-lg flex items-center gap-1`}>
                    {dept.days > 10 ? <span className="text-red-400">↑</span> : <span className="text-emerald-400">↓</span>}
                    {dept.days} Days
                  </div>
                  
                  <div 
                    className={`w-full max-w-[40px] md:max-w-[60px] ${dept.color} rounded-t-xl transition-all duration-500 group-hover/bar:brightness-110 group-hover/bar:shadow-[0_0_15px_rgba(147,51,234,0.3)] ${dept.days > 10 ? 'opacity-90' : ''}`} 
                    style={{ height: dept.height }}
                  ></div>
                  <span className="text-xs font-bold text-slate-500 mt-3 uppercase tracking-wider">{dept.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Source of Hire Donut (1 col) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col group">
            <div className="mb-2">
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Source of Hire</h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Volume & Quality metrics</p>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center py-6 relative">
              {/* Donut Chart */}
              <div
                className="relative size-40 rounded-full group-hover:scale-105 transition-transform duration-500 shadow-inner"
                style={{ background: `conic-gradient(${channels[0].color} 0% 45%, ${channels[1].color} 45% 70%, ${channels[2].color} 70% 90%, ${channels[3].color} 90% 100%)` }}
              >
                <div className="absolute inset-4 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center flex-col shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Top Source</span>
                  <span className="text-xl font-black text-purple-600 dark:text-purple-400 leading-none">LinkedIn</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white mt-1">45%</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400 px-2 mb-1">
                <span>Channel</span>
                <span>Quality</span>
              </div>
              {channels.map((ch) => (
                <div key={ch.label} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: ch.color }}></div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 leading-tight">{ch.label}</span>
                      <span className="text-[10px] font-bold text-slate-500">{ch.pct} volume</span>
                    </div>
                  </div>
                  {/* Quality Badge */}
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                    ch.quality === 'High' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30' : 
                    ch.quality === 'Medium' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30' : 
                    'bg-orange-50 text-orange-600 dark:bg-orange-900/30'
                  }`}>
                    {ch.quality}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
