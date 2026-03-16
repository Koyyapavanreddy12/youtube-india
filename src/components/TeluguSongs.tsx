import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, Heart, MessageCircle, Share2, Volume2, VolumeX, Music } from 'lucide-react';

const TELUGU_SONGS = [
  {
    id: 'ts1',
    title: 'Naatu Naatu - RRR (Ad-Free Premium Video)',
    movie: 'RRR',
    creatorName: 'Telugu Hit Songs',
    source: 'JioSaavn',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    likesCount: '4.5M',
    viewsCount: '150M'
  },
  {
    id: 'ts2',
    title: 'Butta Bomma - Ala Vaikunthapurramuloo',
    movie: 'Ala Vaikunthapurramuloo',
    creatorName: 'Telugu Hit Songs',
    source: 'Naa Songs',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a1a2a2951113?w=800&q=80',
    likesCount: '2.1M',
    viewsCount: '80M'
  },
  {
    id: 'ts3',
    title: 'Samajavaragamana - Ala Vaikunthapurramuloo',
    movie: 'Ala Vaikunthapurramuloo',
    creatorName: 'Telugu Hit Songs',
    source: 'JioSaavn',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80',
    likesCount: '1.8M',
    viewsCount: '65M'
  },
  {
    id: 'ts4',
    title: 'Kalaavathi - Sarkaru Vaari Paata',
    movie: 'Sarkaru Vaari Paata',
    creatorName: 'Telugu Hit Songs',
    source: 'Naa Songs',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
    likesCount: '1.5M',
    viewsCount: '55M'
  },
  {
    id: 'ts5',
    title: 'Oo Antava - Pushpa',
    movie: 'Pushpa: The Rise',
    creatorName: 'Telugu Hit Songs',
    source: 'JioSaavn',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516280440502-85078d154ee4?w=800&q=80',
    likesCount: '3.2M',
    viewsCount: '120M'
  }
];

export default function TeluguSongs() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8 bg-gradient-to-r from-emerald-500/20 to-transparent p-6 rounded-3xl border border-emerald-500/20">
        <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Music className="w-8 h-8 text-black" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
            Telugu Hit Songs
          </h1>
          <p className="text-emerald-400 font-medium">
            Premium Ad-Free Experience • High Quality Video Songs
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {TELUGU_SONGS.map((song, index) => (
          <SongCard key={song.id} song={song} index={index} />
        ))}
      </div>
    </div>
  );
}

function SongCard({ song, index }: { song: typeof TELUGU_SONGS[0], index: number }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group bg-zinc-900/50 rounded-3xl overflow-hidden border border-white/5 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10"
    >
      <div className="relative aspect-video bg-black overflow-hidden cursor-pointer" onClick={togglePlay}>
        {!isPlaying && (
          <img 
            src={song.thumbnailUrl} 
            alt={song.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <video 
          ref={videoRef}
          src={song.videoUrl}
          className={`w-full h-full object-cover ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
          loop
          muted={isMuted}
          playsInline
          onEnded={() => setIsPlaying(false)}
        />
        
        {/* Play Overlay */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-0 group-hover:opacity-100 bg-black/40' : 'opacity-100 bg-black/20'}`}>
          <div className="w-16 h-16 rounded-full bg-emerald-500/90 text-black flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg">
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </div>
        </div>

        {/* Duration Badge */}
        {!isPlaying && (
          <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-white">
            4:32
          </div>
        )}

        {/* Ad-Free Badge */}
        <div className="absolute top-3 left-3 bg-emerald-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-black uppercase tracking-wider flex items-center gap-1">
          <Music className="w-3 h-3" />
          Ad-Free
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg text-white mb-2 line-clamp-1 group-hover:text-emerald-400 transition-colors">
          {song.title}
        </h3>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-white/60 font-medium">
              Movie: <span className="text-white/80">{song.movie}</span>
            </p>
            <p className="text-xs text-emerald-400/80 font-medium flex items-center gap-1">
              <Music className="w-3 h-3" /> Source: {song.source}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-white/5">
          <button className="flex items-center gap-1.5 text-white/60 hover:text-emerald-400 transition-colors">
            <Heart className="w-4 h-4" />
            <span className="text-xs font-medium">{song.likesCount}</span>
          </button>
          <button className="flex items-center gap-1.5 text-white/60 hover:text-emerald-400 transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs font-medium">12K</span>
          </button>
          <button className="flex items-center gap-1.5 text-white/60 hover:text-emerald-400 transition-colors ml-auto">
            <Share2 className="w-4 h-4" />
            <span className="text-xs font-medium">Share</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
