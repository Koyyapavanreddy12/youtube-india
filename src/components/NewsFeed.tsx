import React, { useEffect, useState } from 'react';
import { Newspaper, Globe, TrendingUp, Filter, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

interface NewsItem {
  id: string;
  title: string;
  category: string;
  country: string;
}

export default function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news');
        const data = await response.json();
        setNews(data);
      } catch (err) {
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const categories = ['all', 'technology', 'sports', 'politics', 'business'];

  const filteredNews = filter === 'all' 
    ? news 
    : news.filter(item => item.category === filter);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 text-emerald-500 mb-2">
            <Globe className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Global News</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">World Stream</h1>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${filter === cat ? 'bg-white text-black border-white' : 'bg-white/5 text-white/60 border-white/10 hover:border-white/20'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredNews.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-zinc-900 border border-white/10 rounded-2xl p-6 hover:border-emerald-500/50 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex gap-6 items-center">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                  <Newspaper className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">{item.category}</span>
                    <span className="text-[10px] text-white/20">•</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{item.country}</span>
                  </div>
                  <h3 className="text-lg font-bold group-hover:text-emerald-400 transition-colors">{item.title}</h3>
                  <p className="text-sm text-white/40 mt-1">Live coverage from international sources • 2m ago</p>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-white/20 group-hover:text-white transition-colors" />
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-12 p-8 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 text-center">
        <TrendingUp className="w-8 h-8 text-emerald-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
        <p className="text-sm text-white/60 max-w-md mx-auto">
          Get real-time alerts for breaking news worldwide. Customize your feed based on your interests and location.
        </p>
        <button className="mt-6 bg-emerald-500 text-black px-8 py-3 rounded-full font-bold hover:bg-emerald-600 transition-colors">
          Enable Notifications
        </button>
      </div>
    </div>
  );
}
