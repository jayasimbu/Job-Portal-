import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../../../core/components/EmptyState';
import { searchVideos } from '../../../core/services/youtubeService';
import VideoModal from '../../../core/components/VideoModal';
import { getCurrentUser } from '../../../core/auth/session';
import apiClient from '../../../core/api/apiClient';

// Import Global UI Components
import Button from '../../../components/ui/Button';
import Card, { CardBody, CardHeader, CardFooter } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { Heading, Text } from '../../../components/ui/Typography';

// Import Jobseeker Specific Components
import { ProgressBar, SectionHeader } from '../../jobseeker/components/DesignSystem';

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
    <Card className="animate-pulse">
      <CardBody className="h-96 bg-slate-50/50" />
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 px-4 sm:px-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <Heading level={1}>AI Learning Hub</Heading>
          <Text variant="lead">Personalized curriculum to close your detected skill gaps.</Text>
        </div>
        <Badge variant="primary" className="py-1.5 px-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">auto_awesome</span>
          AI Growth Engine Active
        </Badge>
      </div>

      <div className="flex-1">
        {loading ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : recommendations.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {recommendations.map(course => (
              <Card key={course.id} className="group hover:border-blue-500 transition-all flex flex-col">
                <CardBody className="p-8 flex-1 space-y-8">
                  <div className="flex justify-between items-start">
                    <Badge variant={course.status === 'In Progress' ? 'primary' : 'success'}>
                      {course.status}
                    </Badge>
                    <Badge variant="info" className="bg-emerald-50 text-emerald-700 border-emerald-100">
                      {course.impact} Impact
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <Heading level={3} className="group-hover:text-blue-600 transition-colors">{course.title}</Heading>
                    <div className="flex items-center gap-3">
                      <Text variant="small" className="font-bold uppercase tracking-wider">{course.provider}</Text>
                      <span className="size-1 bg-slate-300 rounded-full" />
                      <Text variant="small" className="font-bold text-slate-400">{course.duration}</Text>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-blue-600 text-sm">psychology</span>
                      <Text variant="small" className="font-bold uppercase tracking-widest text-slate-400">AI Logic</Text>
                    </div>
                    <Text variant="small" className="text-slate-700 font-medium leading-relaxed italic">
                      "{course.matchReason}"
                    </Text>
                  </div>

                  {/* Recommended Videos Section */}
                  {course.videos && course.videos.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-red-500 text-sm">play_circle</span>
                        <Text variant="small" className="font-bold uppercase tracking-widest text-slate-400">Video Modules</Text>
                      </div>
                      <div className="space-y-3">
                        {course.videos.map((vid, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all group/vid cursor-pointer" 
                            onClick={() => setSelectedVideo(vid)}
                          >
                            <div className="w-24 h-14 bg-slate-200 rounded-lg overflow-hidden shrink-0 relative shadow-sm">
                              <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/vid:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-base">play_arrow</span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <Text variant="small" className="font-bold text-slate-700 truncate group-hover/vid:text-blue-600 transition-colors">{vid.title}</Text>
                              <Text variant="small" className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">{vid.channelTitle}</Text>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {course.progress > 0 && (
                    <div className="pt-2">
                      <ProgressBar value={course.progress} label="Curriculum Progress" />
                    </div>
                  )}
                </CardBody>
                <CardFooter className="grid grid-cols-2 gap-4 bg-slate-50/50 p-8">
                  <Button 
                    variant="outline"
                    onClick={() => course.videos?.length > 0 && setSelectedVideo(course.videos[0])}
                    className="w-full"
                  >
                    <span className="material-symbols-outlined mr-2">play_circle</span>
                    Preview
                  </Button>
                  <Button 
                    onClick={() => navigate(`/platform/jobseeker/learning/${course.id}`)}
                    className="w-full"
                  >
                    {course.progress > 0 ? 'Resume' : 'Start'}
                    <span className="material-symbols-outlined ml-2">school</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardBody className="py-20 flex flex-col items-center justify-center text-center space-y-6">
              <div className="size-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                <span className="material-symbols-outlined text-4xl">school</span>
              </div>
              <div className="space-y-2">
                <Heading level={3}>Recommendations Locked</Heading>
                <Text className="max-w-xs mx-auto">Upload your resume to the dashboard first. Our AI will analyze your skill gaps and unlock a personalized learning path.</Text>
              </div>
              <Button onClick={() => navigate('/platform/jobseeker/dashboard')}>
                Go to Dashboard
              </Button>
            </CardBody>
          </Card>
        )}

        {/* Premium Partners Section */}
        <div className="mt-12 space-y-6">
          <SectionHeader title="Growth Partners" icon="stars" iconColor="text-purple-600" bgColor="bg-purple-50" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Coursera', color: 'bg-blue-50 text-blue-700', icon: 'school' },
              { name: 'Udemy', color: 'bg-purple-50 text-purple-700', icon: 'workspace_premium' },
              { name: 'LinkedIn', color: 'bg-sky-50 text-sky-700', icon: 'groups' },
              { name: 'Pluralsight', color: 'bg-rose-50 text-rose-700', icon: 'terminal' }
            ].map(partner => (
              <div key={partner.name} className={`p-6 rounded-2xl ${partner.color} border border-transparent hover:border-current/20 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 group shadow-sm bg-white`}>
                <div className={`size-12 rounded-xl ${partner.color.split(' ')[0]} flex items-center justify-center`}>
                  <span className="material-symbols-outlined text-2xl transition-transform group-hover:scale-110">{partner.icon}</span>
                </div>
                <Text variant="small" className="font-bold uppercase tracking-widest">{partner.name}</Text>
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
