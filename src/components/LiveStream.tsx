import React, { useState } from 'react';
import { Radio, Users, MessageSquare, Send, Heart, Share2, MoreVertical } from 'lucide-react';
import { motion } from 'motion/react';

export default function LiveStream() {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    { id: '1', user: 'Alex', text: 'This is amazing! 🔥' },
    { id: '2', user: 'Sarah', text: 'Greetings from London! 🇬🇧' },
    { id: '3', user: 'Mike', text: 'Can you show the setup?' },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setComments([...comments, { id: Date.now().toString(), user: 'You', text: comment }]);
    setComment('');
  };

  return (
    <div className="h-[calc(100vh-4rem)] bg-black flex flex-col lg:flex-row">
      {/* Video Area */}
      <div className="flex-1 relative bg-zinc-900 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Radio className="w-20 h-20 text-red-500 animate-pulse mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Live Stream Starting...</h2>
            <p className="text-white/40">Connecting to global servers</p>
          </div>
        </div>

        {/* HUD */}
        <div className="absolute top-6 left-6 flex items-center gap-3">
          <div className="bg-red-500 text-white px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 uppercase tracking-wider">
            <span className="w-2 h-2 bg-white rounded-full animate-ping" />
            Live
          </div>
          <div className="bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            1.2K
          </div>
        </div>

        <div className="absolute top-6 right-6 flex items-center gap-2">
          <button className="p-2 bg-black/60 backdrop-blur-md rounded-full hover:bg-black transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-2 bg-black/60 backdrop-blur-md rounded-full hover:bg-black transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full border-2 border-emerald-500 overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=streamer" alt="Streamer" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Global Explorer Live</h3>
              <p className="text-sm text-white/80">Exploring the streets of Tokyo 🇯🇵</p>
            </div>
            <button className="ml-auto bg-emerald-500 text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-emerald-600 transition-colors">
              Follow
            </button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-full lg:w-96 bg-zinc-900 border-l border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-500" />
            <span className="font-bold uppercase tracking-widest text-sm">Live Chat</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">Real-time</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          {comments.map((c) => (
            <motion.div 
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-white/5 flex-shrink-0" />
              <div>
                <span className="text-xs font-bold text-white/40 block mb-0.5">{c.user}</span>
                <p className="text-sm bg-white/5 p-3 rounded-2xl rounded-tl-none">{c.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-black/20">
          <div className="relative">
            <input 
              type="text" 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Say something..."
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-4 pr-12 focus:outline-none focus:border-emerald-500/50 transition-colors text-sm"
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-emerald-500 hover:text-emerald-400 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
