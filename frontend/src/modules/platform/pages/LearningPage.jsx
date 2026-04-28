import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { searchVideos } from '../../../core/services/youtubeService';

const MOCK_COURSES = {
  1: { title: 'Advanced React Patterns', query: 'advanced react patterns tutorial' },
  2: { title: 'Node.js Backend Architecture', query: 'node js backend architecture tutorial' },
  3: { title: 'Cloud Native Infrastructure', query: 'cloud native infrastructure tutorial aws' }
};

const LearningPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const courseInfo = MOCK_COURSES[id] || { title: 'Custom Learning Path', query: 'programming tutorial' };
  
  const [videos, setVideos] = useState([]);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      const results = await searchVideos(courseInfo.query, 5);
      setVideos(results);
      setLoading(false);
    };
    fetchVideos();
  }, [courseInfo.query]);

  const activeVideo = videos[activeVideoIndex];

  const handleVideoComplete = () => {
    const newProgress = Math.min(100, Math.round(((activeVideoIndex + 1) / videos.length) * 100));
    setProgress(newProgress);
    if (activeVideoIndex < videos.length - 1) {
      setActiveVideoIndex(activeVideoIndex + 1);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-[#0b1016] -m-6 p-6">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">{courseInfo.title}</h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">AI Curated Learning Path</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Course Progress</p>
            <p className="text-sm font-bold text-blue-600">{progress}%</p>
          </div>
          <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 overflow-hidden">
        {/* Left Pane: Video Player */}
        <div className="flex-[2] flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {loading ? (
            <div className="w-full aspect-video bg-slate-100 dark:bg-slate-800 animate-pulse flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600">movie</span>
            </div>
          ) : activeVideo ? (
            <>
              <div className="w-full aspect-video bg-black relative">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1`}
                  title={activeVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-6 overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{activeVideo.title}</h2>
                    <p className="text-sm text-slate-500 mt-1">{activeVideo.channelTitle}</p>
                  </div>
                  <button onClick={handleVideoComplete} className="shrink-0 px-4 py-2 bg-green-50 dark:bg-green-500/10 text-green-600 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-green-100 dark:hover:bg-green-500/20 transition-colors flex items-center gap-2 border border-green-200 dark:border-green-500/20">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Mark Completed
                  </button>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Description</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{activeVideo.description || 'No description available for this video.'}</p>
                </div>
              </div>
            </>
          ) : (
             <div className="flex-1 flex items-center justify-center flex-col text-slate-400">
                <span className="material-symbols-outlined text-4xl mb-2">error</span>
                <p>No videos found for this topic.</p>
             </div>
          )}
        </div>

        {/* Right Pane: Playlist & Notes */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          {/* Playlist */}
          <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden min-h-0">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Curriculum Playlist</h3>
              <span className="text-[10px] font-bold text-slate-500">{videos.length} Modules</span>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {loading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse mb-2" />
                ))
              ) : videos.map((vid, idx) => (
                <button
                  key={vid.id}
                  onClick={() => setActiveVideoIndex(idx)}
                  className={`w-full text-left flex items-start gap-3 p-3 rounded-xl transition-all ${activeVideoIndex === idx ? 'bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent'}`}
                >
                  <div className="w-20 h-12 bg-black rounded-lg overflow-hidden shrink-0 relative">
                    <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover opacity-80" />
                    {activeVideoIndex === idx && (
                       <div className="absolute inset-0 bg-blue-600/40 flex items-center justify-center">
                         <span className="material-symbols-outlined text-white text-sm">play_arrow</span>
                       </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 py-1">
                    <p className={`text-xs font-bold truncate ${activeVideoIndex === idx ? 'text-blue-600' : 'text-slate-700 dark:text-slate-300'}`}>{idx + 1}. {vid.title}</p>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">{vid.channelTitle}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="h-1/3 min-h-[200px] flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
             <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 bg-slate-50/50 dark:bg-slate-800/20">
               <span className="material-symbols-outlined text-amber-500 text-sm">edit_note</span>
               <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Personal Notes</h3>
             </div>
             <textarea 
               value={notes}
               onChange={(e) => setNotes(e.target.value)}
               placeholder="Jot down key takeaways from this module..."
               className="flex-1 w-full p-4 bg-transparent border-none resize-none focus:ring-0 text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 custom-scrollbar outline-none"
             />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPage;
