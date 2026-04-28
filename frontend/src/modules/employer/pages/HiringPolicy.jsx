import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const POLICY_DEFAULTS = {
  skills_only_mode: true,
  hide_candidate_name: false,
  hide_gender: true,
  hide_age: true,
  hide_photo: true,
  min_ats_score: 60,
  require_github_verification: false,
  max_experience_years: 10,
  preferred_locations: [],
};

export default function HiringPolicy() {
  const navigate = useNavigate();
  const [policy, setPolicy] = useState(POLICY_DEFAULTS);
  const [saved, setSaved] = useState(false);

  const toggle = (key) => setPolicy(p => ({ ...p, [key]: !p[key] }));
  const setNum = (key, val) => setPolicy(p => ({ ...p, [key]: Number(val) }));

  const handleSave = () => {
    localStorage.setItem('hiring_policy', JSON.stringify(policy));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const TOGGLES = [
    { key: 'skills_only_mode', label: 'Skills-Only Evaluation Mode', desc: 'Rank candidates purely based on skills and ATS score, ignoring all demographics.', icon: 'psychology' },
    { key: 'hide_candidate_name', label: 'Anonymize Candidate Names', desc: 'Replace names with "Candidate A, B, C…" to reduce name bias.', icon: 'person_off' },
    { key: 'hide_gender', label: 'Hide Gender Information', desc: 'Remove gender indicators from candidate profiles.', icon: 'gender_neutral' },
    { key: 'hide_age', label: 'Hide Age & Graduation Year', desc: 'Prevent age-based discrimination in screening.', icon: 'no_age_restriction' },
    { key: 'hide_photo', label: 'Hide Profile Photos', desc: 'Remove profile pictures to prevent appearance-based bias.', icon: 'hide_image' },
    { key: 'require_github_verification', label: 'Require Project Verification', desc: 'Only show candidates whose GitHub projects have been verified.', icon: 'verified' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117] text-[#0d141b] dark:text-white">
      <div className="bg-white dark:bg-[#1a2632] border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 className="text-xl font-bold">Bias-Free Hiring Policy Configuration</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Configure how candidates are evaluated and presented</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-10 py-8 flex flex-col gap-6">
        {/* Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 flex gap-4">
          <span className="material-symbols-outlined text-blue-600 text-3xl mt-0.5">balance</span>
          <div>
            <p className="font-bold text-blue-900 dark:text-blue-300 mb-1">Bias-Free Hiring</p>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              These settings help ensure candidates are evaluated on merit alone. Reducing demographic signals leads to more diverse and scientifically optimal hiring outcomes.
            </p>
          </div>
        </div>

        {/* Toggle policies */}
        <div className="bg-white dark:bg-[#1a2632] rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col gap-5">
          <h3 className="font-bold text-base mb-1">Anonymization & Screening Settings</h3>
          {TOGGLES.map(({ key, label, desc, icon }) => (
            <div key={key} className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`size-10 rounded-xl flex items-center justify-center flex-shrink-0 ${policy[key] ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                  <span className="material-symbols-outlined text-base">{icon}</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">{label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
                </div>
              </div>
              <button
                onClick={() => toggle(key)}
                className={`relative flex-shrink-0 mt-0.5 w-12 h-6 rounded-full transition-all duration-200 ${policy[key] ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all duration-200 ${policy[key] ? 'right-0.5' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>

        {/* Numeric thresholds */}
        <div className="bg-white dark:bg-[#1a2632] rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col gap-5">
          <h3 className="font-bold text-base mb-1">Scoring Thresholds</h3>
          <div>
            <label className="block text-sm font-semibold mb-2">Minimum ATS Score Threshold: <span className="text-blue-600">{policy.min_ats_score}</span></label>
            <input
              type="range" min={0} max={100} step={5}
              value={policy.min_ats_score}
              onChange={e => setNum('min_ats_score', e.target.value)}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>0 (All)</span><span>50 (Moderate)</span><span>100 (Top)</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Maximum Experience (years): <span className="text-blue-600">{policy.max_experience_years}</span></label>
            <input
              type="range" min={1} max={20} step={1}
              value={policy.max_experience_years}
              onChange={e => setNum('max_experience_years', e.target.value)}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>1 yr</span><span>10 yrs</span><span>20 yrs</span>
            </div>
          </div>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 h-12 rounded-xl font-bold text-base bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5"
        >
          {saved ? (
            <><span className="material-symbols-outlined text-sm">check_circle</span>Saved!</>
          ) : (
            <><span className="material-symbols-outlined text-sm">save</span>Save Policy Configuration</>
          )}
        </button>
      </div>
    </div>
  );
}
