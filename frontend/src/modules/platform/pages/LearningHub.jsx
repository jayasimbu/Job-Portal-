import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  PlayCircle, 
  BrainCircuit, 
  School, 
  Timer, 
  BarChart3, 
  ChevronRight,
  Play,
  Terminal,
  Users,
  Award,
  BookOpen
} from 'lucide-react';
import EmptyState from '../../../core/components/EmptyState';
import { searchVideos } from '../../../core/services/youtubeService';
import VideoModal from '../../../core/components/VideoModal';
import { getCurrentUser } from '../../../core/auth/session';
import apiClient from '../../../core/api/apiClient';

// Import Global UI Components
import Button from '../../../components/ui/Button';
import Card, { CardBody, CardHeader, CardFooter } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

// Import Jobseeker Specific Components
import { ProgressBar } from '../../jobseeker/components/DesignSystem';

const LearningHub = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const user = getCurrentUser();

  useEffect(() => {
    const fetchLearningData = async () => {
      try {
        if (!user?.id) {
          setLoading(false);
          return;
        }
        
        const response = await apiClient.get(`/jobseeker/learning/${user.id}`);
        const backendRecs = response.data.learning || [];
        
        if (backendRecs.length === 0) {
          setRecommendations([]);
          setLoading(false);
          return;
        }

        const coursesWithVideos = await Promise.all(backendRecs.map(async (course, idx) => {
          const query = `${course.title} tutorial`;
          const videos = await searchVideos(query, 3);
          return { 
            id: idx + 1,
            ...course, 
            videos 
          };
        }));
        setRecommendations(coursesWithVideos);
      } catch (err) {
        console.error('Failed to fetch learning recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningData();
  }, [user?.id]);

  const SkeletonCard = () => (
    <div className="h-96 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-3xl" />
  );

  return (
    <div className="space-y-8 pt-2">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">Learning Engine</h1>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Personalized Curriculum & Skill Acquisition</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50">
            <Sparkles size={14} className="text-blue-600" />
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">AI Synthesis Active</span>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {loading ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : recommendations.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {recommendations.map(course => (
              <div key={course.id} className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] overflow-hidden flex flex-col shadow-sm hover:border-blue-500/30 transition-all">
                <div className="p-8 flex-1 space-y-8">
                  <div className="flex justify-between items-start">
                    <span className={`px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest ${
                      course.status === 'In Progress' ? 'bg-blue-600 text-white' : 'bg-emerald-500 text-white'
                    }`}>
                      {course.status}
                    </span>
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-100 dark:border-slate-700">
                      <BarChart3 size={12} /> {course.impact} Impact
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-blue-600 transition-colors leading-none">{course.title}</h3>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <span className="text-slate-900 dark:text-slate-300 font-black">{course.provider}</span>
                      <span className="text-slate-200 dark:text-slate-800">•</span>
                      <span className="flex items-center gap-1.5"><Timer size={12} /> {course.duration}</span>
                    </div>
                  </div>

                  <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <BrainCircuit size={14} className="text-blue-600" />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">AI Rationale</span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic">
                      "{course.matchReason}"
                    </p>
                  </div>

                  {/* Video Modules */}
                  {course.videos && course.videos.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <PlayCircle size={14} className="text-rose-500" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Curriculum Modules</span>
                      </div>
                      <div className="space-y-2">
                        {course.videos.map((vid, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all group/vid cursor-pointer" 
                            onClick={() => setSelectedVideo(vid)}
                          >
                            <div className="w-20 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden shrink-0 relative shadow-sm">
                              <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/vid:opacity-100 transition-opacity flex items-center justify-center">
                                <Play size={16} className="text-white fill-white" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-black text-slate-700 dark:text-slate-300 truncate group-hover/vid:text-blue-600 transition-colors uppercase tracking-tight">{vid.title}</p>
                              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">{vid.channelTitle}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {course.progress > 0 && (
                    <div className="pt-2">
                      <div className="flex justify-between items-center mb-2">
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Course Progress</span>
                         <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{course.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                         <div className="h-full bg-blue-600 rounded-full" style={{ width: `${course.progress}%` }}></div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-px bg-slate-100 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-800">
                  <button 
                    onClick={() => course.videos?.length > 0 && setSelectedVideo(course.videos[0])}
                    className="h-14 bg-white dark:bg-slate-900 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors"
                  >
                    Preview Curriculum
                  </button>
                  <button 
                    onClick={() => navigate(`/platform/jobseeker/learning/${course.id}`)}
                    className="h-14 bg-white dark:bg-slate-900 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                  >
                    {course.progress > 0 ? 'Resume Course' : 'Start Curriculum'}
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem]">
             <div className="size-20 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center text-slate-200 mx-auto mb-6">
                <BrainCircuit size={40} />
             </div>
             <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Recommendations Locked</h3>
             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] max-w-sm mx-auto mb-8 leading-relaxed">Complete your profile to unlock a personalized skill-acquisition roadmap.</p>
             <Button onClick={() => navigate('/platform/jobseeker/dashboard')} className="h-12 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest">
                Optimize Profile
             </Button>
          </div>
        )}

        {/* Growth Partners Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
             <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.3em]">Knowledge Partners</h3>
             <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Coursera', color: 'text-blue-600', icon: School, bg: 'bg-blue-50' },
              { name: 'Udemy', color: 'text-purple-600', icon: Award, bg: 'bg-purple-50' },
              { name: 'LinkedIn', color: 'text-sky-600', icon: Users, bg: 'bg-sky-50' },
              { name: 'Pluralsight', color: 'text-rose-600', icon: Terminal, bg: 'bg-rose-50' }
            ].map(partner => (
              <div key={partner.name} className="p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-blue-500/20 transition-all group flex flex-col items-center justify-center gap-4 cursor-pointer shadow-sm">
                <div className={`size-12 rounded-2xl ${partner.bg} dark:bg-slate-800 flex items-center justify-center ${partner.color}`}>
                  <partner.icon size={24} className="transition-transform group-hover:scale-110" />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <VideoModal 
        isOpen={!!selectedVideo} 
        onClose={() => setSelectedVideo(null)} 
        video={selectedVideo} 
      />
    </div>
  );
};

export default LearningHub;



