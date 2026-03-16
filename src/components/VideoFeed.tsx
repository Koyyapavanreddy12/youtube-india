import React, { useEffect, useState } from 'react';
import { db, collection, query, where, orderBy, onSnapshot, limit } from '../firebase';
import { Video as VideoType } from '../types';
import VideoCard from './VideoCard';
import { motion, AnimatePresence } from 'motion/react';

interface VideoFeedProps {
  type?: 'short' | 'long';
}

export default function VideoFeed({ type }: VideoFeedProps) {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = query(
      collection(db, 'videos'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    if (type) {
      q = query(
        collection(db, 'videos'),
        where('type', '==', type),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const videoData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as VideoType[];
      setVideos(videoData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [type]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500"></div>
        <p className="text-white/40 text-sm">Loading feed...</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
          <PlayIcon className="w-10 h-10 text-white/20" />
        </div>
        <h3 className="text-xl font-bold mb-2">No videos yet</h3>
        <p className="text-white/40 max-w-xs">Be the first to upload a video and start the community!</p>
      </div>
    );
  }

  if (type === 'short') {
    return (
      <div className="h-[calc(100vh-4rem)] overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
        <AnimatePresence>
          {videos.map((video) => (
            <div key={video.id} className="h-full w-full snap-start snap-always">
              <VideoCard video={video} format="short" />
            </div>
          ))}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} format="long" />
      ))}
    </div>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
