import React, { useState, useRef, useEffect } from 'react';
import { Video as VideoType } from '../types';
import { Heart, MessageCircle, Share2, UserPlus, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';
import { formatDistanceToNow } from 'date-fns';
import { db, doc, updateDoc, increment } from '../firebase';

interface VideoCardProps {
  video: VideoType;
  format: 'short' | 'long';
}

export default function VideoCard({ video, format }: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleLike = async () => {
    setIsLiked(!isLiked);
    try {
      await updateDoc(doc(db, 'videos', video.id), {
        likesCount: increment(isLiked ? -1 : 1)
      });
    } catch (err) {
      console.error('Error updating like:', err);
    }
  };

  if (format === 'short') {
    return (
      <div className="relative h-full w-full bg-zinc-900 flex items-center justify-center group">
        <video 
          ref={videoRef}
          src={video.videoUrl}
          className="h-full w-full object-cover"
          loop
          muted={isMuted}
          playsInline
          onClick={togglePlay}
        />

        {/* Overlay Controls */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />

        <div className="absolute bottom-4 left-4 right-16 pointer-events-none">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden pointer-events-auto">
              <img 
                src={video.creatorPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video.creatorId}`} 
                alt={video.creatorName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="pointer-events-auto">
              <h4 className="font-bold text-sm">@{video.creatorName}</h4>
              <button className="text-[10px] bg-emerald-500 text-black px-2 py-0.5 rounded-full font-bold mt-0.5">
                Follow
              </button>
            </div>
          </div>
          <p className="text-sm line-clamp-2 mb-2">{video.title}</p>
          <div className="flex items-center gap-2 text-xs text-white/60">
            <span className="bg-white/10 px-2 py-0.5 rounded">#trending</span>
            <span className="bg-white/10 px-2 py-0.5 rounded">#global</span>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="absolute right-4 bottom-20 flex flex-col gap-6 items-center">
          <button onClick={handleLike} className="flex flex-col items-center gap-1 group/btn">
            <div className={`p-3 rounded-full transition-colors ${isLiked ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
            </div>
            <span className="text-xs font-medium">{video.likesCount}</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 group/btn">
            <div className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium">{video.commentsCount}</span>
          </button>

          <button className="flex flex-col items-center gap-1 group/btn">
            <div className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
              <Share2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium">{video.sharesCount}</span>
          </button>

          <button onClick={() => setIsMuted(!isMuted)} className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>
        </div>

        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Play className="w-16 h-16 text-white/40 fill-current" />
          </div>
        )}
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group cursor-pointer"
    >
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900 mb-3">
        <img 
          src={video.thumbnailUrl || 'https://picsum.photos/seed/video/800/450'} 
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-bold">
          12:45
        </div>
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Play className="w-12 h-12 text-white fill-current" />
        </div>
      </div>
      
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-white/10">
          <img 
            src={video.creatorPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video.creatorId}`} 
            alt={video.creatorName}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm line-clamp-2 group-hover:text-emerald-400 transition-colors">{video.title}</h3>
          <p className="text-xs text-white/60 mt-1 hover:text-white transition-colors">{video.creatorName}</p>
          <div className="flex items-center gap-1.5 text-[10px] text-white/40 mt-0.5">
            <span>{video.likesCount} likes</span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
