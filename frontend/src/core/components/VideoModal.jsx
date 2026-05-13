import React from 'react';

const VideoModal = ({ isOpen, onClose, video }) => {
  if (!isOpen || !video) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm " onClick={onClose}>
      <div className="bg-slate-50 dark:bg-slate-900 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-slate-300 dark:border-slate-700" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-slate-900 dark:text-white truncate pr-4">{video.title}</h3>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="relative w-full aspect-video bg-black">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className="p-4 bg-slate-100 dark:bg-slate-800/50">
          <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{video.description || 'No description available.'}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;



