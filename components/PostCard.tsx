
import React, { useState } from 'react';
import { Post } from '../types';
import { Icons } from '../constants';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  return (
    <article className="p-6 border-b border-slate-100 dark:border-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all cursor-pointer group relative">
      <div className="flex gap-5">
        <div className="flex-shrink-0">
          <div className="relative">
            <img 
              src={post.userAvatar} 
              alt={post.userName} 
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800 ring-offset-2 dark:ring-offset-slate-950 transition-transform group-hover:scale-105"
            />
            {post.isAiGenerated && (
              <div className="absolute -bottom-1 -right-1 bg-brand-500 text-white p-1 rounded-lg border-2 border-white dark:border-slate-950">
                <Icons.Sparkles />
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <span className="font-black text-slate-900 dark:text-slate-100 hover:text-brand-600 transition-colors truncate">{post.userName}</span>
              <span className="text-slate-400 dark:text-slate-500 text-sm font-bold truncate tracking-tight">{post.userHandle}</span>
              <span className="text-slate-300 dark:text-slate-600 text-sm font-medium">· {post.timestamp}</span>
            </div>
            {!post.isAiGenerated && (
              <button className="text-slate-400 hover:text-brand-500 transition-colors p-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>
            )}
          </div>
          
          <p className="text-[1.1rem] text-slate-800 dark:text-slate-200 leading-[1.6] whitespace-pre-wrap font-medium tracking-tight">
            {post.content}
          </p>

          {post.image && (
            <div className="mt-5 rounded-[2rem] overflow-hidden border border-slate-200/50 dark:border-slate-800 shadow-sm transition-all group-hover:shadow-lg">
              <img src={post.image} alt="Post content" className="w-full h-auto object-cover max-h-[550px] transition-transform duration-1000 group-hover:scale-[1.03]" />
            </div>
          )}

          <div className="mt-6 flex items-center justify-between text-slate-400 dark:text-slate-500 max-w-[450px]">
            <button className="flex items-center gap-2.5 hover:text-brand-500 dark:hover:text-brand-400 transition-all group/action">
              <div className="p-2.5 rounded-xl group-hover/action:bg-brand-50 dark:group-hover/action:bg-brand-900/40 transition-all group-hover/action:scale-110">
                <Icons.Comment />
              </div>
              <span className="text-sm font-black">{post.comments}</span>
            </button>
            <button className="flex items-center gap-2.5 hover:text-emerald-500 dark:hover:text-emerald-400 transition-all group/action">
              <div className="p-2.5 rounded-xl group-hover/action:bg-emerald-50 dark:group-hover/action:bg-emerald-900/40 transition-all group-hover/action:scale-110">
                <Icons.Reblue />
              </div>
              <span className="text-sm font-black">{post.reblues}</span>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleLike(); }}
              className={`flex items-center gap-2.5 transition-all group/action ${liked ? 'text-rose-500' : 'hover:text-rose-500'}`}
            >
              <div className={`p-2.5 rounded-xl transition-all ${liked ? 'bg-rose-50 dark:bg-rose-950/40 scale-110' : 'group-hover/action:bg-rose-50 dark:group-hover/action:bg-rose-950/40 group-hover/action:scale-110'}`}>
                <Icons.Heart filled={liked} />
              </div>
              <span className="text-sm font-black">{likeCount}</span>
            </button>
            <button className="hover:text-brand-500 dark:hover:text-brand-400 transition-all p-2.5 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-900/40 group-hover:scale-110">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
