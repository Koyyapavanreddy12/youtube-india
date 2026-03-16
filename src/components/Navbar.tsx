import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Play, Radio, Newspaper, Upload, User, LogIn, Search } from 'lucide-react';
import { UserProfile } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NavbarProps {
  user: UserProfile | null;
  onAuthClick: () => void;
}

export default function Navbar({ user, onAuthClick }: NavbarProps) {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/shorts', icon: Play, label: 'Shorts' },
    { path: '/live', icon: Radio, label: 'Live' },
    { path: '/news', icon: Newspaper, label: 'News' },
  ];

  return (
    <>
      {/* Desktop Top Nav */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-md border-b border-white/10 z-50 px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Play className="text-black fill-current w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tighter hidden sm:block">GlobalStream</span>
        </Link>

        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text" 
              placeholder="Search videos, creators..." 
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link 
                to="/upload" 
                className="hidden sm:flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span className="text-sm font-medium">Upload</span>
              </Link>
              <Link to={`/profile/${user.uid}`} className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
                <img 
                  src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                  alt={user.displayName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </Link>
            </>
          ) : (
            <button 
              onClick={onAuthClick}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black px-4 py-2 rounded-full transition-colors font-bold"
            >
              <LogIn className="w-4 h-4" />
              <span className="text-sm">Sign In</span>
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-black border-t border-white/10 z-50 px-4 flex items-center justify-around md:hidden">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              location.pathname === item.path ? "text-emerald-500" : "text-white/60 hover:text-white"
            )}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
        {user && (
          <Link 
            to="/upload"
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              location.pathname === '/upload' ? "text-emerald-500" : "text-white/60 hover:text-white"
            )}
          >
            <Upload className="w-6 h-6" />
            <span className="text-[10px] font-medium">Upload</span>
          </Link>
        )}
      </nav>
    </>
  );
}
