import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCompanyProfile } from '../services/companyService';
import { UI } from '../../../constants/ui';

export default function CompanyProfilePage() {
  const { employerId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!employerId) return;
    setLoading(true);
    fetchCompanyProfile(employerId)
      .then(d => { setData(d?.data ?? d); setLoading(false); })
      .catch(() => { setError('Company profile not found.'); setLoading(false); });
  }, [employerId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
         <div className="size-12 bg-blue-600/10 rounded-xl flex items-center justify-center animate-pulse">
            <span className="material-symbols-outlined text-blue-600">business</span>
         </div>
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Profile...</p>
      </div>
    </div>
  );

  if (error || !data) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-6 p-8">
      <div className="size-20 bg-rose-50 rounded-[2rem] flex items-center justify-center text-rose-500">
         <span className="material-symbols-outlined text-4xl">domain_disabled</span>
      </div>
      <div className="text-center">
         <h1 className="text-2xl font-black text-slate-900 uppercase">Profile Not Found</h1>
         <p className="text-slate-400 font-bold text-xs mt-2">The requested company could not be located.</p>
      </div>
      <button onClick={() => navigate(-1)} className={UI.BTN_PRIMARY}>Go Back</button>
    </div>
  );

  const { company = {}, jobs = [] } = data;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-20">
      
      {/* Header / Hero */}
      <header className="relative h-[40vh] min-h-[350px] flex items-end pb-16 overflow-hidden bg-slate-900">
         <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-10" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
         </div>

         <div className="max-w-6xl mx-auto w-full px-8 relative z-20">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-10">
               <div className="size-32 bg-white rounded-3xl border-4 border-slate-800 shadow-2xl flex items-center justify-center p-6 shrink-0">
                 {company.logo ? (
                   <img src={company.logo} alt="Logo" className="size-full object-contain" />
                 ) : (
                   <span className="material-symbols-outlined text-slate-200 text-5xl">business</span>
                 )}
               </div>
               
               <div className="flex-1 text-center md:text-left space-y-3">
                  <div className="flex items-center justify-center md:justify-start gap-3">
                     <span className="px-2.5 py-1 bg-blue-600 text-white rounded-md text-[9px] font-black uppercase tracking-widest">Verified Employer</span>
                     <div className="flex items-center gap-1.5 text-amber-400">
                        <span className="material-symbols-outlined text-sm fill-current">star</span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Top Rated</span>
                     </div>
                  </div>
                  <h1 className="text-5xl font-black tracking-tight text-white leading-none">{company.name || 'Company Profile'}</h1>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                     <span className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-blue-500">location_on</span> {company.location || 'Global'}</span>
                     <span className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-blue-500">category</span> {company.industry || 'Technology'}</span>
                     <span className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-blue-500">groups</span> {company.company_size || '100-500'} employees</span>
                  </div>
               </div>

               <div className="flex items-center gap-3 shrink-0">
                  <button className="size-12 bg-white/10 border border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all">
                     <span className="material-symbols-outlined">share</span>
                  </button>
                  <button className={UI.BTN_PRIMARY + " h-12 px-8"}>
                     Follow Company
                  </button>
               </div>
            </div>
         </div>
      </header>

      <main className="max-w-6xl mx-auto w-full px-8 grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12 items-start mt-[-2rem] relative z-30">
        
        {/* Left Column */}
        <div className="space-y-10">
          <section className={UI.CARD_BASE + " p-10 space-y-6"}>
            <div className="flex items-center gap-2 border-b border-slate-50 pb-4">
               <span className="material-symbols-outlined text-blue-500">info</span>
               <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">About the Company</h2>
            </div>
            <p className="text-base leading-relaxed text-slate-600 font-medium whitespace-pre-wrap">
              {company.about || 'This company has not provided a detailed description yet.'}
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-500">work</span>
                  <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Open Opportunities</h2>
               </div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {jobs.length} Positions
               </span>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <div 
                    key={job.id} 
                    className={UI.CARD_BASE + " p-6 hover:border-blue-200 transition-all cursor-pointer flex items-center justify-between group"} 
                    onClick={() => navigate(`/platform/jobseeker/jobs/${job.id}`)}
                  >
                    <div className="space-y-2">
                       <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                       <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                         <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-xs">location_on</span> {job.location || 'Remote'}</span>
                         <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-xs">schedule</span> {job.employment_type?.replace('_', ' ') || 'Full-time'}</span>
                       </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-300 group-hover:text-blue-600 transition-all group-hover:translate-x-1">chevron_right</span>
                  </div>
                ))
              ) : (
                <div className="p-16 border-2 border-dashed border-slate-200 rounded-3xl text-center">
                   <span className="material-symbols-outlined text-slate-300 text-4xl mb-4">work_outline</span>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No active job postings at this time.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <aside className="space-y-6 lg:sticky lg:top-24">
           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl" />
              
              <div className="space-y-6 relative z-10">
                 <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <span className="material-symbols-outlined text-blue-500 text-sm">analytics</span>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quick Stats</h3>
                 </div>

                 <div className="space-y-6">
                    <div className="flex justify-between">
                       <div>
                          <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Founded</p>
                          <p className="text-base font-black">{company.founded_year || 'N/A'}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Type</p>
                          <p className="text-base font-black text-blue-400">Private</p>
                       </div>
                    </div>
                    
                    <div className="pt-4 border-t border-white/5">
                       <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Industry</p>
                       <p className="text-base font-black">{company.industry || 'Technology'}</p>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                       <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Website</p>
                       {company.website ? (
                         <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-400 hover:underline">
                           <span className="text-sm font-black truncate">{company.website.replace(/^https?:\/\//, '')}</span>
                           <span className="material-symbols-outlined text-xs">open_in_new</span>
                         </a>
                       ) : (
                         <p className="text-sm font-black text-slate-600">Not listed</p>
                       )}
                    </div>
                 </div>
              </div>
           </div>

           <div className={UI.CARD_BASE + " p-8 text-center"}>
              <div className="size-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                 <span className="material-symbols-outlined">verified</span>
              </div>
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2">Verified Profile</h4>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">This company has been verified by the LINKUP platform.</p>
           </div>
        </aside>

      </main>

      <footer className="mt-20 py-8 border-t border-slate-100 text-center">
         <p className="text-[10px] font-semibold text-slate-300 uppercase tracking-[0.4em]">© LINKUP • {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
