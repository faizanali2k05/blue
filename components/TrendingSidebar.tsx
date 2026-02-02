
import React from 'react';

interface SuggestedUser {
  id: string;
  name: string;
  handle: string;
  avatar: string;
}

interface TrendingSidebarProps {
  followingIds: string[];
  onFollow: (userId: string) => void;
  onUnfollow: (userId: string) => void;
}

const TrendingSidebar: React.FC<TrendingSidebarProps> = ({ followingIds, onFollow, onUnfollow }) => {
  // Hardcoded dummy suggestions removed. In a real app, this would be fetched from an API.
  const suggestions: SuggestedUser[] = [];

  return (
    <div className="hidden lg:block w-[350px] h-screen sticky top-0 p-6 pt-10 border-l border-slate-200 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-bold text-slate-500 dark:text-slate-400">Suggested for you</h2>
        {suggestions.length > 0 && (
          <button className="text-xs font-bold text-slate-900 dark:text-white hover:opacity-70 transition-opacity">See All</button>
        )}
      </div>

      <div className="space-y-5">
        {suggestions.length > 0 ? (
          suggestions.map((u) => {
            const isFollowing = followingIds.includes(u.id);
            return (
              <div key={u.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <img src={u.avatar} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800" alt={u.name} />
                  <div className="text-sm">
                    <p className="font-bold text-slate-900 dark:text-white leading-tight">{u.handle}</p>
                    <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">{u.name}</p>
                  </div>
                </div>
                <button 
                  onClick={() => isFollowing ? onUnfollow(u.id) : onFollow(u.id)}
                  className={`text-xs font-bold px-4 py-1.5 rounded-lg transition-all ${
                    isFollowing 
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' 
                      : 'bg-brand-600 text-white hover:bg-brand-700'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            );
          })
        ) : (
          <p className="text-xs text-slate-400 dark:text-slate-600 font-medium">No new suggestions at this time.</p>
        )}
      </div>
      
      <div className="mt-12 px-2 text-[11px] text-slate-300 dark:text-slate-700 font-bold flex flex-wrap gap-x-3 gap-y-2 uppercase tracking-widest">
        <span>About</span>
        <span>Help</span>
        <span>Press</span>
        <span>API</span>
        <span>Jobs</span>
        <span>Privacy</span>
        <span className="mt-4 block w-full">© 2024 BLUE</span>
      </div>
    </div>
  );
};

export default TrendingSidebar;
