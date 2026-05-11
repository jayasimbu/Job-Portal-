import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchApplications } from '../../jobseeker/services/jobseekerService';
import { mapApplication } from '../../../core/api/adapters';
import { getCurrentUserId } from '../../../core/auth/session';

// Import Global UI Components
import Button from '../../../components/ui/Button';
import Card, { CardBody } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { Heading, Text } from '../../../components/ui/Typography';

const STATUS_CONFIG = {
  applied:      { variant: 'primary', icon: 'send', label: 'Applied' },
  reviewing:    { variant: 'warning', icon: 'visibility', label: 'Reviewing' },
  interviewing: { variant: 'info', icon: 'record_voice_over', label: 'Interview Scheduled' },
  offered:      { variant: 'success', icon: 'celebration', label: 'Offered 🎉' },
  rejected:     { variant: 'danger', icon: 'close', label: 'Not Selected' },
  shortlisted:  { variant: 'success', icon: 'star', label: 'Shortlisted ✅' },
};

export default function Applications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedAppId, setExpandedAppId] = useState(null);
  const userId = getCurrentUserId();

  useEffect(() => {
    const loadApps = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const data = await fetchApplications(userId);
        if (data.applications) {
          const mapped = data.applications.map(app => ({
             ...app,
             ...mapApplication(app)
          }));
          setApplications(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch applications", err);
      } finally {
        setLoading(false);
      }
    };
    loadApps();
  }, [userId]);

  const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 px-4 sm:px-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <Heading level={1}>Hiring Pipeline</Heading>
          <Text variant="lead">Track and manage your active applications in real-time.</Text>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
          {['all', 'applied', 'shortlisted', 'interviewing', 'rejected', 'offered'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${filter === s ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          [1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardBody className="h-24 bg-slate-50/50" />
            </Card>
          ))
        ) : filtered.length > 0 ? (
          filtered.map(app => {
            const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.applied;
            const isExpanded = expandedAppId === app.id;
            const atsScore = Math.round(app.ats_score || 0);

            return (
              <Card 
                key={app.id}
                className={`transition-all hover:border-blue-300 cursor-pointer ${isExpanded ? 'ring-2 ring-blue-500/10 border-blue-500' : ''}`}
                onClick={() => setExpandedAppId(isExpanded ? null : app.id)}
              >
                <CardBody className="p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-5">
                      <div className="size-14 bg-slate-50 rounded-2xl flex items-center justify-center font-bold text-xl text-slate-300 border border-slate-100 uppercase">
                        {(app.company || 'C')[0]}
                      </div>
                      <div className="space-y-1">
                        <Heading level={4} className="leading-tight">{app.job_title || 'Software Role'}</Heading>
                        <div className="flex items-center gap-2">
                          <Text variant="small" className="font-semibold text-slate-500">{app.company || 'Enterprise Corp'}</Text>
                          <span className="size-1 bg-slate-300 rounded-full" />
                          <Text variant="small" className="font-bold text-blue-600 uppercase tracking-widest">{atsScore}% AI Score</Text>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={cfg.variant}>
                        {cfg.label}
                      </Badge>
                      <span className={`material-symbols-outlined text-slate-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>expand_more</span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-8 pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-top-4 duration-300 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Text variant="small" className="font-bold uppercase tracking-widest text-slate-400">Matched Strengths</Text>
                          <div className="flex flex-wrap gap-2">
                            {(app.skills_match?.matched_keywords || ['Verified Skills']).map((s, i) => (
                              <Badge key={i} variant="success" className="px-2 py-1 text-[10px]">{s}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <Text variant="small" className="font-bold uppercase tracking-widest text-slate-400">Skill Gaps</Text>
                          <div className="flex flex-wrap gap-2">
                            {(app.missing_keywords || []).length > 0 ? app.missing_keywords.map((s, i) => (
                              <Badge key={i} variant="danger" className="px-2 py-1 text-[10px]">{s}</Badge>
                            )) : <Text variant="small" className="text-emerald-600 font-bold">Optimal Coverage!</Text>}
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="material-symbols-outlined text-blue-600 text-sm">psychology</span>
                          <Text variant="small" className="font-bold text-blue-600 uppercase tracking-widest">AI Strategic Forecast</Text>
                        </div>
                        <Text variant="small" className="text-slate-700 font-medium leading-relaxed">
                          {atsScore >= 75 ? "Your profile is a top-tier match for this role. We recommend preparing for technical discussions focused on your core stack." : "To improve visibility, consider bridging the skill gaps highlighted above for future applications in this category."}
                        </Text>
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/platform/jobseeker/jobs/${app.job_id || 1}/analysis`) }}>
                          Job Details
                        </Button>
                        <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); navigate('/platform/jobseeker/profile') }}>
                          Update Profile
                        </Button>
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            );
          })
        ) : (
          <Card className="border-dashed">
            <CardBody className="py-20 flex flex-col items-center justify-center text-center space-y-6">
              <div className="size-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                <span className="material-symbols-outlined text-4xl">work_history</span>
              </div>
              <div className="space-y-2">
                <Heading level={3}>No Applications Yet</Heading>
                <Text className="max-w-xs mx-auto">Start applying to jobs in the marketplace to see them tracked here.</Text>
              </div>
              <Button onClick={() => navigate('/platform/jobseeker/jobs')}>
                Explore Marketplace
              </Button>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
