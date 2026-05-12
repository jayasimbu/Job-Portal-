import React, { useState } from 'react';
import { Layout, Type, ChevronDown, Sparkles } from 'lucide-react';
import jobRoles from '../../data/job_roles.json';
import sampleJds from '../../data/sample_jds.json';

const JDInputCard = ({ onAnalyze, isAnalyzing, disabled }) => {
  const [activeTab, setActiveTab] = useState('paste'); // 'paste' or 'select'
  const [jdText, setJdText] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const handleRoleChange = (e) => {
    const roleId = e.target.value;
    setSelectedRole(roleId);
    if (roleId) {
      setJdText(sampleJds[roleId] || '');
    }
  };

  const handleAnalyze = () => {
    if (jdText.trim()) {
      onAnalyze(jdText);
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="flex items-center justify-center size-8 rounded-full bg-indigo-100 text-indigo-600 text-sm font-bold">2</span>
          Paste / Select Job Description
        </h2>

        <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
          <button
            onClick={() => setActiveTab('paste')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'paste' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Type className="size-4" />
            Paste JD
          </button>
          <button
            onClick={() => setActiveTab('select')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'select' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Layout className="size-4" />
            Select Existing Job
          </button>
        </div>

        <div className="space-y-4">
          {activeTab === 'select' && (
            <div className="relative">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Select Job Role</label>
              <div className="relative">
                <select
                  value={selectedRole}
                  onChange={handleRoleChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 font-medium"
                >
                  <option value="">-- Choose a template --</option>
                  {jobRoles.map(role => (
                    <option key={role.id} value={role.id}>{role.title}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Job Description</label>
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the job description here to analyze skill gaps..."
              className="w-full h-40 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 transition-all resize-none"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !jdText.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-indigo-200"
          >
            {isAnalyzing ? (
              <Sparkles className="size-5 animate-pulse" />
            ) : (
              <Sparkles className="size-5 group-hover:scale-110 transition-transform" />
            )}
            Analyze JD Match
          </button>
        </div>
      </div>
    </div>
  );
};

export default JDInputCard;
