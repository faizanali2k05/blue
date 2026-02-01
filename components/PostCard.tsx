
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
    <article className="p-5 border-b border-slate-100 dark:border-slate-900 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-all cursor-pointer group">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <img 
            src={post.userAvatar} 
            alt={post.userName} 
            className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800 ring-offset-2 dark:ring-offset-slate-900"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-extrabold text-slate-900 dark:text-slate-100 hover:underline transition-colors">{post.userName}</span>
              <span className="text-slate-500 dark:text-slate-500 text-sm font-medium">{post.userHandle}</span>
              <span className="text-slate-400 dark:text-slate-600 text-sm">· {post.timestamp}</span>
            </div>
            {post.isAiGenerated && (
              <span className="bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1.5 tracking-wider border border-brand-100 dark:border-brand-900/50">
                <Icons.Sparkles /> AI
              </span>
            )}
          </div>
          
          <p className="mt-3 text-[1.05rem] text-slate-800 dark:text-slate-300 leading-[1.6] whitespace-pre-wrap font-medium">
            {post.content}
          </p>

          {post.image && (
            <div className="mt-4 rounded-[1.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
              <img src={post.image} alt="Post content" className="w-full h-auto object-cover max-h-[500px] transition-transform duration-700 group-hover:scale-[1.02]" />
            </div>
          )}

          <div className="mt-5 flex items-center justify-between text-slate-500 dark:text-slate-500 max-w-[420px]">
            <button className="flex items-center gap-2 hover:text-brand-500 dark:hover:text-brand-400 transition-colors group/action">
              <div className="p-2.5 rounded-full group-hover/action:bg-brand-50 dark:group-hover/action:bg-brand-900/30 transition-all">
                <Icons.Comment />
              </div>
              <span className="text-sm font-bold">{post.comments}</span>
            </button>
            <button className="flex items-center gap-2 hover:text-green-500 dark:hover:text-green-400 transition-colors group/action">
              <div className="p-2.5 rounded-full group-hover/action:bg-green-50 dark:group-hover/action:bg-green-900/30 transition-all">
                <Icons.Reblue />
              </div>
              <span className="text-sm font-bold">{post.reblues}</span>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleLike(); }}
              className={`flex items-center gap-2 transition-colors group/action ${liked ? 'text-rose-500' : 'hover:text-rose-500'}`}
            >
              <div className={`p-2.5 rounded-full transition-all ${liked ? 'bg-rose-50 dark:bg-rose-950/30' : 'group-hover/action:bg-rose-50 dark:group-hover/action:bg-rose-950/30'}`}>
                <Icons.Heart filled={liked} />
              </div>
              <span className="text-sm font-bold">{likeCount}</span>
            </button>
            <button className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors p-2.5 rounded-full hover:bg-brand-50 dark:hover:bg-brand-900/30">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
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
