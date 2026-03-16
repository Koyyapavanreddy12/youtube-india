import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload as UploadIcon, X, CheckCircle2, Loader2, Play, FileVideo } from 'lucide-react';
import { db, auth, collection, addDoc, serverTimestamp } from '../firebase';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface UploadProps {
  user: UserProfile;
}

export default function Upload({ user }: UploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'short' | 'long'>('short');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const videoFile = acceptedFiles[0];
    if (videoFile) {
      setFile(videoFile);
      setPreview(URL.createObjectURL(videoFile));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'video/*': [] },
    maxFiles: 1
  });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !auth.currentUser) return;

    setIsUploading(true);
    
    try {
      // In a real app, you'd upload to Storage first. 
      // For this demo, we'll use a placeholder URL.
      const videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
      const thumbnailUrl = 'https://picsum.photos/seed/thumb/800/450';

      await addDoc(collection(db, 'videos'), {
        creatorId: auth.currentUser.uid,
        creatorName: user.displayName,
        creatorPhoto: user.photoURL,
        title,
        description,
        videoUrl,
        thumbnailUrl,
        type,
        likesCount: 0,
        commentsCount: 0,
        sharesCount: 0,
        tags: [],
        createdAt: serverTimestamp()
      });

      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setFile(null);
        setPreview(null);
        setTitle('');
        setDescription('');
      }, 3000);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Upload Video</h1>
        <p className="text-white/60">Share your moments with the world.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Dropzone / Preview */}
        <div className="space-y-4">
          {!file ? (
            <div 
              {...getRootProps()} 
              className={`aspect-[9/16] max-w-[300px] mx-auto border-2 border-dashed rounded-3xl flex flex-col items-center justify-center p-10 transition-colors cursor-pointer ${isDragActive ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/10 hover:border-white/20 bg-white/5'}`}
            >
              <input {...getInputProps()} />
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                <UploadIcon className="w-8 h-8 text-emerald-500" />
              </div>
              <p className="text-sm font-bold text-center">Select video to upload</p>
              <p className="text-xs text-white/40 text-center mt-2">Or drag and drop a file</p>
              <div className="mt-6 space-y-2">
                <p className="text-[10px] text-white/30 text-center">MP4 or WebM</p>
                <p className="text-[10px] text-white/30 text-center">Up to 60 seconds for Shorts</p>
              </div>
            </div>
          ) : (
            <div className="relative aspect-[9/16] max-w-[300px] mx-auto rounded-3xl overflow-hidden bg-zinc-900 border border-white/10">
              <video src={preview!} className="w-full h-full object-cover" controls />
              <button 
                onClick={() => { setFile(null); setPreview(null); }}
                className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-white/60">Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your video a catchy title"
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-white/60">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about your video"
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button"
              onClick={() => setType('short')}
              className={`flex items-center justify-center gap-2 py-4 rounded-2xl border transition-all ${type === 'short' ? 'bg-emerald-500 border-emerald-500 text-black font-bold' : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'}`}
            >
              <Play className="w-4 h-4" />
              Shorts
            </button>
            <button 
              type="button"
              onClick={() => setType('long')}
              className={`flex items-center justify-center gap-2 py-4 rounded-2xl border transition-all ${type === 'long' ? 'bg-emerald-500 border-emerald-500 text-black font-bold' : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'}`}
            >
              <FileVideo className="w-4 h-4" />
              Long Video
            </button>
          </div>

          <button 
            type="submit"
            disabled={!file || isUploading || uploadSuccess}
            className="w-full bg-white text-black py-4 rounded-2xl font-bold hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading...
              </>
            ) : uploadSuccess ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Uploaded Successfully!
              </>
            ) : (
              'Post Video'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
