
import React, { useState } from 'react';
import { Post } from '../types';
import { Icons } from '../constants';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [saved, setSaved] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  return (
    <article className="bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-900 mb-4 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <img 
            src={post.userAvatar} 
            alt={post.userName} 
            className="w-8 h-8 rounded-full border border-slate-100 dark:border-slate-800"
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900 dark:text-white hover:underline cursor-pointer">{post.userHandle}</span>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        </button>
      </div>

      {/* Image */}
      {post.image ? (
        <div className="w-full aspect-square md:rounded-lg overflow-hidden border-y border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <img src={post.image} alt="Post content" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="px-4 py-8 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-100 dark:border-slate-800">
           <p className="text-lg font-medium text-slate-900 dark:text-slate-100 leading-relaxed italic">"{post.content}"</p>
        </div>
      )}

      {/* Actions */}
      <div className="px-3 pt-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleLike}
            className={`transition-all active:scale-125 ${liked ? 'text-rose-500' : 'text-slate-900 dark:text-white hover:text-slate-500'}`}
          >
            <Icons.Heart filled={liked} />
          </button>
          <button className="text-slate-900 dark:text-white hover:text-slate-500 transition-colors">
            <Icons.Comment />
          </button>
          <button className="text-slate-900 dark:text-white hover:text-slate-500 transition-colors">
            <svg className="w-6 h-6 rotate-[15deg]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <button 
          onClick={() => setSaved(!saved)}
          className={`transition-colors ${saved ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}
        >
          <svg className={`w-6 h-6 ${saved ? 'fill-current' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      {/* Captions & Stats */}
      <div className="px-4 mt-2 space-y-1 text-sm">
        <p className="font-bold text-slate-900 dark:text-white">{likeCount.toLocaleString()} likes</p>
        <div className="flex gap-2">
          <span className="font-bold text-slate-900 dark:text-white">{post.userHandle}</span>
          <span className="text-slate-700 dark:text-slate-300">{post.content}</span>
        </div>
        {post.comments > 0 && (
          <button className="text-slate-500 dark:text-slate-500 font-medium block">View all {post.comments} comments</button>
        )}
        <p className="text-[10px] text-slate-400 dark:text-slate-600 uppercase font-bold tracking-wider pt-1">{post.timestamp}</p>
      </div>
    </article>
  );
};

export default PostCard;
