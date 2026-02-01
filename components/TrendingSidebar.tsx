
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
    <div className="hidden lg:block w-80 h-screen sticky top-0 p-6 border-l border-slate-200 dark:border-slate-800 dark:bg-slate-950">
      <div className="bg-slate-100 dark:bg-slate-900 rounded-[2rem] p-6 mb-6 border border-slate-200/50 dark:border-slate-800 transition-colors duration-300">
        <h2 className="text-xl font-black mb-6 text-slate-900 dark:text-white tracking-tight">Trending</h2>
        {loading ? (
          <div className="space-y-6 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-2">
                <div className="h-2 w-16 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                <div className="h-4 w-32 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                <div className="h-3 w-48 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {trends.map((trend, i) => (
              <div key={i} className="group cursor-pointer">
                <p className="text-[10px] text-slate-500 dark:text-slate-500 font-black uppercase tracking-[0.1em] mb-1">Trending · Global</p>
                <h3 className="font-extrabold text-slate-900 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors text-lg leading-tight">#{trend.topic.replace(/\s+/g, '')}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 font-medium leading-relaxed">{trend.summary}</p>
                {trend.links && trend.links.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {trend.links.map((link, idx) => (
                      <a 
                        key={idx}
                        href={link} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline truncate max-w-[140px] bg-brand-50 dark:bg-brand-950/30 px-2 py-0.5 rounded-md"
                      >
                        {new URL(link).hostname}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-slate-100 dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200/50 dark:border-slate-800 transition-colors duration-300">
        <h2 className="text-xl font-black mb-6 text-slate-900 dark:text-white tracking-tight">Follow</h2>
        <div className="space-y-6">
          {[
            { name: 'Gemini AI', handle: '@googleai', avatar: 'https://picsum.photos/id/1/100/100' },
            { name: 'Blue Team', handle: '@teamblue', avatar: 'https://picsum.photos/id/2/100/100' }
          ].map((u, i) => (
            <div key={i} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <img src={u.avatar} className="w-11 h-11 rounded-full ring-2 ring-white dark:ring-slate-800 transition-transform group-hover:scale-105" alt={u.name} />
                <div className="text-sm">
                  <p className="font-extrabold text-slate-900 dark:text-slate-200">{u.name}</p>
                  <p className="text-slate-500 dark:text-slate-500 font-medium">{u.handle}</p>
                </div>
              </div>
              <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black px-5 py-2.5 rounded-full hover:scale-105 transition-all active:scale-95">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 px-4 text-[11px] text-slate-400 dark:text-slate-600 font-bold flex flex-wrap gap-x-4 gap-y-2 uppercase tracking-widest">
        <span className="hover:text-slate-600 transition-colors cursor-pointer">Terms</span>
        <span className="hover:text-slate-600 transition-colors cursor-pointer">Privacy</span>
        <span className="hover:text-slate-600 transition-colors cursor-pointer">Cookies</span>
        <span className="hover:text-slate-600 transition-colors cursor-pointer">Ads</span>
        <span className="cursor-default">© 2024 Blue</span>
      </div>
    </div>
  );
};

export default TrendingSidebar;
