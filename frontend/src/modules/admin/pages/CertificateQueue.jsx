import React, { useEffect, useState } from 'react';
import AdminShell from '../components/AdminShell';
import { fetchCertificateQueue, verifyCertificate } from '../services/adminService';

const CertificateQueue = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadQueue = async () => {
    try {
      const res = await fetchCertificateQueue();
      if (res?.queue) setQueue(res.queue);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
    // eslint-disable-next-line
  }, []);

  const handleVerify = async (certId, status) => {
    try {
      await verifyCertificate(certId, status);
      // Remove from queue locally
      setQueue((prev) => prev.filter(c => c.id !== certId));
    } catch (e) {
      alert("Verification failed");
    }
  };

  return (
    <AdminShell active="certificates">
      <div className="max-w-[1200px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 p-6">
        <header className="flex flex-col gap-1">
          <h1 className="text-[26px] font-bold text-slate-900 dark:text-white tracking-tight uppercase mt-1">Certificate Verification</h1>
          <p className="text-[15px] text-slate-500 dark:text-slate-400 leading-relaxed mt-1">Review AI parsed certificates and verify them manually for ATS scaling.</p>
        </header>
        {loading ? (
          <div className="animate-pulse flex flex-col gap-4">
             <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
             <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          </div>
        ) : queue.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-[#1a2632]">
             <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">verified</span>
             <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">No Pending Verifications</h3>
             <p className="text-sm text-slate-500">The verification queue is fully clear.</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {queue.map(cert => (
              <div key={cert.id} className="bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-500/50 transition-all overflow-hidden flex flex-col md:flex-row group">
                <div className="w-full md:w-1/3 p-8 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#131d26]">
                  <div className="flex items-center gap-3 mb-4">
                     <span className="material-symbols-outlined text-blue-600 text-3xl">workspace_premium</span>
                     <div>
                       <p className="font-black text-lg text-slate-800 dark:text-white truncate">{cert.certificate_name}</p>
                       <p className="text-sm font-bold text-slate-500">{cert.issuer}</p>
                     </div>
                  </div>
                  
                  <div className="flex flex-col gap-3 mt-6">
                     <a href={cert.file_url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition duration-150 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300">
                       <span className="material-symbols-outlined text-[18px]">open_in_new</span> View Original Document
                     </a>
                     <div className="text-xs text-slate-400 font-bold bg-white dark:bg-[#1a2632] p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                        Uploaded: {new Date(cert.created_at).toLocaleString()}
                        <br/>User ID: {cert.user_id}
                     </div>
                  </div>
                </div>
                
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-4 flex items-center gap-2">
                       <span className="material-symbols-outlined text-blue-500 text-[16px]">psychology</span> AI Extraction Data
                    </h4>
                    <div className="bg-slate-50 dark:bg-[#0d141b] rounded-2xl p-5 border border-slate-100 dark:border-slate-800/50 mb-8 font-mono text-xs text-slate-600 dark:text-slate-400 h-24 overflow-y-auto leading-relaxed">
                       {cert.ocr_text || "No text extracted by OCR engine."}
                    </div>
                    
                    <div className="flex gap-6 mb-2">
                       <div>
                         <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Confidence Score</p>
                         <p className="text-2xl font-black text-slate-800 dark:text-white">{cert.confidence_score}%</p>
                       </div>
                       <div>
                         <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">AI Verdict</p>
                         <p className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                           cert.confidence_level === 'High' ? 'bg-green-100 text-green-700' : 
                           cert.confidence_level === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 
                           'bg-red-100 text-red-700'
                         }`}>
                           {cert.confidence_level === 'High' ? '🟢' : cert.confidence_level === 'Medium' ? '🟡' : '🔴'} {cert.confidence_level} Confidence
                         </p>
                       </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
                    <button onClick={() => handleVerify(cert.id, 'verified')} className="flex-1 px-4 py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl text-[10px] uppercase tracking-widest font-black flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-[0_8px_20px_rgba(34,197,94,0.3)]">
                      <span className="material-symbols-outlined text-sm">verified</span> Verify Concept
                    </button>
                    <button onClick={() => handleVerify(cert.id, 'rejected')} className="flex-1 px-4 py-4 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 rounded-2xl text-[10px] uppercase tracking-widest font-black flex items-center justify-center gap-2 transition-transform active:scale-95">
                      <span className="material-symbols-outlined text-sm">close</span> Reject Flag
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
};

export default CertificateQueue;
