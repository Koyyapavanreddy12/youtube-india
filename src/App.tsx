import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth, onAuthStateChanged, db, doc, getDoc, setDoc } from './firebase';
import { UserProfile } from './types';
import Navbar from './components/Navbar';
import VideoFeed from './components/VideoFeed';
import Profile from './components/Profile';
import Upload from './components/Upload';
import LiveStream from './components/LiveStream';
import NewsFeed from './components/NewsFeed';
import AuthModal from './components/AuthModal';
import TeluguSongs from './components/TeluguSongs';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as UserProfile);
        } else {
          const newUser: UserProfile = {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || 'Anonymous',
            email: firebaseUser.email || '',
            photoURL: firebaseUser.photoURL || '',
            followersCount: 0,
            followingCount: 0,
            createdAt: new Date().toISOString()
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
          setUser(newUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-black text-white font-sans">
        <Navbar user={user} onAuthClick={() => setShowAuthModal(true)} />
        
        <main className="pt-16 pb-20 md:pb-0">
          <Routes>
            <Route path="/" element={<VideoFeed />} />
            <Route path="/shorts" element={<VideoFeed type="short" />} />
            <Route path="/telugu-songs" element={<TeluguSongs />} />
            <Route path="/live" element={<LiveStream />} />
            <Route path="/news" element={<NewsFeed />} />
            <Route 
              path="/profile/:uid" 
              element={user ? <Profile currentUser={user} /> : <Navigate to="/" />} 
            />
            <Route 
              path="/upload" 
              element={user ? <Upload user={user} /> : <Navigate to="/" />} 
            />
          </Routes>
        </main>

        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      </div>
    </Router>
  );
}
