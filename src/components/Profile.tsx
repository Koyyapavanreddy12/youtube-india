import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db, doc, getDoc, collection, query, where, onSnapshot } from '../firebase';
import { UserProfile, Video as VideoType } from '../types';
import VideoCard from './VideoCard';
import { motion } from 'motion/react';
import { Settings, Grid, Heart, Bookmark, Users } from 'lucide-react';

interface ProfileProps {
  currentUser: UserProfile;
}

export default function Profile({ currentUser }: ProfileProps) {
  const { uid } = useParams<{ uid: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'videos' | 'liked' | 'saved'>('videos');

  const isOwnProfile = currentUser.uid === uid;

  useEffect(() => {
    if (!uid) return;

    const fetchProfile = async () => {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data() as UserProfile);
      }
    };

    const q = query(collection(db, 'videos'), where('creatorId', '==', uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const videoData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as VideoType[];
      setVideos(videoData);
      setLoading(false);
    });

    fetchProfile();
    return () => unsubscribe();
  }, [uid]);

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white/10 shadow-xl">
          <img 
            src={profile.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.uid}`} 
            alt={profile.displayName}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold tracking-tight">{profile.displayName}</h1>
            <div className="flex items-center justify-center md:justify-start gap-2">
              {isOwnProfile ? (
                <>
                  <button className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-zinc-200 transition-colors">
                    Edit Profile
                  </button>
                  <button className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <button className="bg-emerald-500 text-black px-8 py-2 rounded-full font-bold text-sm hover:bg-emerald-600 transition-colors">
                  Follow
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-8 mb-6">
            <div className="text-center md:text-left">
              <span className="block text-xl font-bold">{videos.length}</span>
              <span className="text-xs text-white/40 uppercase tracking-wider">Videos</span>
            </div>
            <div className="text-center md:text-left">
              <span className="block text-xl font-bold">{profile.followersCount}</span>
              <span className="text-xs text-white/40 uppercase tracking-wider">Followers</span>
            </div>
            <div className="text-center md:text-left">
              <span className="block text-xl font-bold">{profile.followingCount}</span>
              <span className="text-xs text-white/40 uppercase tracking-wider">Following</span>
            </div>
          </div>

          <p className="text-white/80 max-w-md mx-auto md:mx-0">
            {profile.bio || "No bio yet. Sharing my world through GlobalStream! 🌍✨"}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-white/10">
        <div className="flex items-center justify-center gap-12 -mt-px">
          <button 
            onClick={() => setActiveTab('videos')}
            className={`flex items-center gap-2 py-4 border-t-2 transition-all ${activeTab === 'videos' ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-white/40 hover:text-white'}`}
          >
            <Grid className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Videos</span>
          </button>
          <button 
            onClick={() => setActiveTab('liked')}
            className={`flex items-center gap-2 py-4 border-t-2 transition-all ${activeTab === 'liked' ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-white/40 hover:text-white'}`}
          >
            <Heart className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Liked</span>
          </button>
          <button 
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-2 py-4 border-t-2 transition-all ${activeTab === 'saved' ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-white/40 hover:text-white'}`}
          >
            <Bookmark className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Saved</span>
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="py-8">
        {videos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} format="long" />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-3xl">
            <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-1">No videos yet</h3>
            <p className="text-sm text-white/40">When you upload videos, they'll appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
