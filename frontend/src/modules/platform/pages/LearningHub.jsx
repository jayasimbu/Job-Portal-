import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../../../core/components/EmptyState';
import { searchVideos } from '../../../core/services/youtubeService';
import VideoModal from '../../../core/components/VideoModal';
import { getCurrentUser } from '../../../core/auth/session';
import apiClient from '../../../core/api/apiClient';

// Mock data removed - now using backend API

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

        // Simulate AI thinking and API fetching for YouTube videos
        const coursesWithVideos = await Promise.all(backendRecs.map(async (course, idx) => {
          // Construct search query
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
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl animate-pulse shadow-sm">
      <div className="flex justify-between mb-6">
        <div className="h-5 w-24 bg-slate-100 dark:bg-slate-800 rounded-full" />
        <div className="h-5 w-20 bg-slate-50 dark:bg-slate-800 rounded-full" />
      </div>
      <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-full mb-3" />
      <div className="h-4 w-1/2 bg-slate-100 dark:bg-slate-800 rounded-full mb-8" />
      <div className="h-24 bg-slate-50 dark:bg-slate-800/50 rounded-2xl mb-6" />
      <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
    </div>
  );

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <header className="flex-shrink-0 mb-6">
        <div className="flex items-center gap-3 mb-1">
           <span className="material-symbols-outlined text-blue-600">auto_awesome</span>
           <h2 className="text-[10px] font-black text-blue-600 tracking-[0.2em] uppercase">AI Growth Engine</h2>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase">AI Learning Hub</h1>
        <p className="text-sm text-slate-500">Personalized curriculum to close your detected skill gaps.</p>
      </header>

      <div className="flex-1 overflow-y-auto min-h-0 pr-2 custom-scrollbar">
        {loading ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : recommendations.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-6">
            {recommendations.map(course => (
              <div key={course.id} className="group p-6 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 transition-all shadow-sm flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${course.status === 'In Progress' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                    {course.status}
                  </div>
                  <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100/50">
                    {course.impact}
                  </div>
                </div>

                <div className="mb-4 relative z-10">
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight leading-tight">{course.title}</h3>
                  <p className="text-xs font-bold text-slate-500 uppercase mt-1">{course.provider} • {course.duration}</p>
                </div>

                <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 mb-6 relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-blue-600 text-sm">psychology</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Why this course?</span>
                  </div>
                  <p className="text-[13px] font-medium text-slate-700 leading-relaxed italic">
                    "{course.matchReason}"
                  </p>
                </div>

                {/* Recommended Videos Section */}
                {course.videos && course.videos.length > 0 && (
                  <div className="mb-6 flex-1 relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="material-symbols-outlined text-red-500 text-sm">play_circle</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recommended Videos</span>
                    </div>
                    <div className="space-y-2">
                      {course.videos.map((vid, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors group/vid cursor-pointer" onClick={() => setSelectedVideo(vid)}>
                          <div className="w-20 h-12 bg-slate-200 rounded overflow-hidden shrink-0 relative">
                            <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/vid:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="material-symbols-outlined text-white text-sm">play_arrow</span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-slate-700 truncate group-hover/vid:text-blue-600 transition-colors">{vid.title}</p>
                            <p className="text-[9px] text-slate-500 truncate">{vid.channelTitle}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {course.progress > 0 && (
                  <div className="mb-6 relative z-10">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      <span>Course Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${course.progress}%` }} />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 relative z-10 mt-auto">
                  <button 
                    onClick={() => course.videos?.length > 0 && setSelectedVideo(course.videos[0])}
                    className="h-11 bg-red-50 hover:bg-red-100 text-red-600 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 border border-red-200/50"
                  >
                    <span className="material-symbols-outlined text-sm">play_circle</span>
                    Watch Preview
                  </button>
                  <button 
                    onClick={() => navigate(`/platform/jobseeker/learning/${course.id}`)}
                    className="h-11 bg-[#111827] text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
                  >
                    {course.progress > 0 ? 'Resume' : 'Start Curriculum'}
                    <span className="material-symbols-outlined text-sm">school</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState 
            icon="description"
            title="Recommendations Locked"
            description="Upload your resume to the dashboard first. Our AI will analyze your skill gaps and unlock a personalized learning path."
            actionText="Go to Dashboard"
            onAction={() => navigate('/platform/jobseeker/dashboard')}
          />
        )}

        {/* Premium Partners Section */}
        <div className="mt-8 mb-10">
           <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-purple-600">stars</span>
              <h3 className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">Premium Growth Partners</h3>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Coursera', color: 'bg-blue-50 text-blue-700', icon: 'school' },
                { name: 'Udemy', color: 'bg-purple-50 text-purple-700', icon: 'workspace_premium' },
                { name: 'LinkedIn', color: 'bg-sky-50 text-sky-700', icon: 'groups' },
                { name: 'Pluralsight', color: 'bg-rose-50 text-rose-700', icon: 'terminal' }
              ].map(partner => (
                <div key={partner.name} className={`p-4 rounded-2xl ${partner.color} border border-transparent hover:border-current/20 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group shadow-sm`}>
                   <span className="material-symbols-outlined text-2xl transition-transform">{partner.icon}</span>
                   <span className="text-[10px] font-black uppercase tracking-widest">{partner.name}</span>
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
