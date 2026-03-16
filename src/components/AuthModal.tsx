import React, { useState } from 'react';
import { auth, googleProvider, signInWithPopup } from '../firebase';
import { X, Mail, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome to GlobalStream</h2>
          <p className="text-white/60">Join the community to share and watch videos.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button 
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 rounded-2xl font-bold hover:bg-zinc-200 transition-colors"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            Continue with Google
          </button>

          <button className="w-full flex items-center justify-center gap-3 bg-zinc-800 text-white py-4 rounded-2xl font-bold hover:bg-zinc-700 transition-colors">
            <Mail className="w-5 h-5" />
            Continue with Email
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-white/40 px-8">
          By continuing, you agree to GlobalStream's Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}
