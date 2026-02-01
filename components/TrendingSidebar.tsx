
import React, { useEffect, useState } from 'react';
import { GeminiService } from '../services/geminiService';

const TrendingSidebar: React.FC = () => {
  const [trends, setTrends] = useState<{ topic: string, summary: string, links: string[] }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const gemini = GeminiService.getInstance();
        const results = await gemini.getTrendingTopics();
        setTrends(results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, []);

  return (
    <div className="hidden lg:block w-[350px] h-screen sticky top-0 p-6 border-l border-slate-200 dark:border-slate-800 dark:bg-slate-950 no-scrollbar overflow-y-auto">
      <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] p-7 mb-8 border border-slate-200/60 dark:border-slate-800 shadow-premium transition-all duration-500">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-[900] text-slate-900 dark:text-white tracking-tighter">What's Hot</h2>
          <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
        </div>

        {loading ? (
          <div className="space-y-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-3">
                <div className="h-2 w-16 skeleton rounded-full opacity-50"></div>
                <div className="h-5 w-40 skeleton rounded-lg"></div>
                <div className="h-4 w-full skeleton rounded-lg opacity-70"></div>
              </div>
            ))}
          </div>
        ) : trends.length > 0 ? (
          <div className="space-y-10">
            {trends.map((trend, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.15em]">
                    {i === 0 ? '🔥 Breaking' : 'Technology · Trending'}
                  </p>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                    {Math.floor(Math.random() * 50 + 10)}k Posts
                  </span>
                </div>
                
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-all text-xl leading-tight">
                  <span className="text-brand-500 mr-0.5">#</span>{trend.topic.replace(/\s+/g, '')}
                </h3>
                
                <p className="text-[13px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-2 font-medium leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                  {trend.summary}
                </p>

                {trend.links && trend.links.length > 0 && (
                  <div className="mt-3.5 flex flex-wrap gap-2">
                    {trend.links.map((link, idx) => (
                      <a 
                        key={idx}
                        href={link} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center gap-1.5 text-[10px] font-black text-brand-600 dark:text-brand-400 hover:scale-105 transition-all bg-brand-50 dark:bg-brand-900/30 px-3 py-1.5 rounded-full border border-brand-100/50 dark:border-brand-900/50"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                        </svg>
                        {new URL(link).hostname.replace('www.', '')}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-slate-400 dark:text-slate-600 font-bold text-sm">
            Everything is quiet right now.
          </div>
        )}
      </div>

      <div className="mt-10 px-6 text-[10px] text-slate-400 dark:text-slate-600 font-black flex flex-wrap gap-x-5 gap-y-3 uppercase tracking-[0.2em] mb-10">
        <span className="hover:text-brand-500 transition-colors cursor-pointer">Terms</span>
        <span className="hover:text-brand-500 transition-colors cursor-pointer">Privacy</span>
        <span className="hover:text-brand-500 transition-colors cursor-pointer">Cookies</span>
        <span className="cursor-default">© 2024 BLUE</span>
      </div>
    </div>
  );
};

export default TrendingSidebar;
