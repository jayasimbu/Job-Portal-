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
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${filter === s ? 'bg-slate-900 text-white shadow-xl scale-[1.02]' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          [1, 2, 3].map(i => (
            <Card key={i} className="">
              <CardBody className="h-24 bg-slate-100/50" />
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
                className="transition-all hover:border-blue-300 shadow-sm"
              >
                <CardBody className="p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-5">
                      <div className="size-14 bg-slate-100 rounded-2xl flex items-center justify-center font-bold text-xl text-slate-300 border border-slate-200 uppercase">
                        {(app.company || 'C')[0]}
                      </div>
                      <div className="space-y-1">
                        <Heading level={4} className="leading-tight">{app.job_title || 'Software Role'}</Heading>
                        <div className="flex items-center gap-2">
                          <Text variant="small" className="font-semibold text-slate-500">{app.company || 'Enterprise Corp'}</Text>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 mr-4">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest"
                          onClick={(e) => { e.stopPropagation(); navigate(`/platform/jobseeker/jobs/${app.job_id}`) }}
                        >
                          Job Details
                        </Button>
                      </div>
                      <Badge variant={cfg.variant}>
                        {cfg.label}
                      </Badge>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })
        ) : (
          <div className="space-y-8">
            <Card className="border-dashed">
              <CardBody className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="size-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300">
                  <span className="material-symbols-outlined text-3xl">work_history</span>
                </div>
                <div className="space-y-1">
                  <Heading level={3}>Quiet for now</Heading>
                  <Text className="max-w-xs mx-auto text-sm">Your application journey starts here. Explore matching roles to get started.</Text>
                </div>
                <Button onClick={() => navigate('/platform/jobseeker/jobs')} size="sm">
                  Find Your Match
                </Button>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}



