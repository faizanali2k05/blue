
import React, { useState, useEffect } from 'react';
import { AppTab, Post, User, UserSettings } from './types';
import { Icons } from './constants';
import Sidebar from './components/Sidebar';
import PostCard from './components/PostCard';
import TrendingSidebar from './components/TrendingSidebar';
import Auth from './components/Auth';
import EditProfileModal from './components/EditProfileModal';
import SettingsView from './components/SettingsView';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<UserSettings>({
    darkMode: false,
    emailNotifications: true,
    pushNotifications: true,
    contentFilter: 'standard'
  });
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostText, setNewPostText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [profileViewMode, setProfileViewMode] = useState<'grid' | 'list'>('grid');
  const [followingIds, setFollowingIds] = useState<string[]>([]);

  // Initialize Auth & Data
  useEffect(() => {
    const savedUser = localStorage.getItem('blue_user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));

    const savedPosts = localStorage.getItem('blue_posts');
    if (savedPosts) setPosts(JSON.parse(savedPosts));

    const savedSettings = localStorage.getItem('blue_settings');
    if (savedSettings) setSettings(JSON.parse(savedSettings));

    const savedFollowing = localStorage.getItem('blue_following');
    if (savedFollowing) setFollowingIds(JSON.parse(savedFollowing));

    setTimeout(() => setIsLoading(false), 800);
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('blue_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    if (currentUser) localStorage.setItem('blue_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('blue_following', JSON.stringify(followingIds));
  }, [followingIds]);

  useEffect(() => {
    localStorage.setItem('blue_settings', JSON.stringify(settings));
    if (settings.darkMode) {
       document.documentElement.classList.add('dark');
    } else {
       document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const handleLogin = (user: User) => {
    setCurrentUser({
      ...user,
      joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('blue_user');
    setCurrentUser(null);
  };

  const updateProfile = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handlePost = (imageUrl?: string) => {
    if (!currentUser || (!newPostText.trim() && !imageUrl)) return;

    const newPost: Post = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userHandle: currentUser.handle,
      userAvatar: currentUser.avatar,
      content: newPostText,
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      reblues: 0,
      image: imageUrl
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
  };

  const toggleFollow = (userId: string) => {
    setFollowingIds(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  if (isLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950">
      <div className="w-12 h-12 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center animate-pulse">
        <span className="text-white dark:text-black font-black italic text-xl">B</span>
      </div>
    </div>
  );

  if (!currentUser) return <Auth onLogin={handleLogin} />;

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.HOME:
        return (
          <div className="max-w-[600px] mx-auto flex flex-col pt-4">
            {/* Stories Bar */}
            <div className="flex gap-4 px-4 overflow-x-auto no-scrollbar py-2 border-b border-slate-100 dark:border-slate-900 mb-2">
              <div className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer group">
                <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-yellow-400 to-fuchsia-600 transition-transform group-hover:scale-105 active:scale-95">
                  <div className="w-full h-full rounded-full border-2 border-white dark:border-slate-950 overflow-hidden bg-slate-200">
                    <img src={currentUser.avatar} alt="Me" className="w-full h-full object-cover" />
                  </div>
                </div>
                <span className="text-[11px] font-bold dark:text-white truncate w-16 text-center">Your Story</span>
              </div>
              {/* Only show stories for users actually followed */}
              {followingIds.map(id => (
                <div key={id} className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer group">
                   <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-yellow-400 to-fuchsia-600">
                    <div className="w-full h-full rounded-full border-2 border-white dark:border-slate-950 overflow-hidden bg-slate-200">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`} alt="User" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <span className="text-[11px] font-bold dark:text-white truncate w-16 text-center">User_{id.slice(0,3)}</span>
                </div>
              ))}
            </div>

            {/* Feed */}
            <div className="flex flex-col pb-20">
              {posts.length === 0 ? (
                <div className="p-20 text-center flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full border-2 border-slate-900 dark:border-white flex items-center justify-center mb-6">
                    <Icons.Camera />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Share Photos</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm max-w-[240px]">When you share photos, they will appear on your profile.</p>
                  <button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="mt-6 text-brand-600 font-bold">Share your first photo</button>
                </div>
              ) : (
                posts.map(post => <PostCard key={post.id} post={post} />)
              )}
            </div>
          </div>
        );

      case AppTab.EXPLORE:
        return (
          <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <div className="relative mb-8">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Icons.Search /></span>
              <input 
                type="text" 
                placeholder="Search" 
                className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl py-3 pl-12 pr-4 focus:ring-0 text-sm dark:text-white"
              />
            </div>
            {/* Removed dummy picsum images grid. Only show real content if available. */}
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4 text-slate-300">
                <Icons.Search />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Search the Blue Community</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Discover new people and ideas.</p>
            </div>
          </div>
        );

      case AppTab.PROFILE:
        return (
          <div className="max-w-4xl mx-auto pt-8 px-4 flex flex-col pb-20">
            <header className="flex gap-8 items-start mb-12">
              <div className="w-20 h-20 md:w-40 md:h-40 rounded-full overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800">
                <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                  <h2 className="text-xl font-medium text-slate-900 dark:text-white">{currentUser.handle}</h2>
                  <div className="flex gap-2">
                    <button onClick={() => setShowEditModal(true)} className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-sm font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Edit profile</button>
                    <button onClick={() => setActiveTab(AppTab.SETTINGS)} className="p-2 text-slate-900 dark:text-white"><Icons.Settings /></button>
                  </div>
                </div>
                <div className="hidden md:flex gap-10 mb-6">
                  <span className="text-sm"><b className="text-slate-900 dark:text-white">{posts.filter(p => p.userId === currentUser.id).length}</b> posts</span>
                  <span className="text-sm"><b className="text-slate-900 dark:text-white">{currentUser.followers}</b> followers</span>
                  <span className="text-sm"><b className="text-slate-900 dark:text-white">{followingIds.length}</b> following</span>
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{currentUser.name}</div>
                <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{currentUser.bio}</div>
              </div>
            </header>

            <div className="md:hidden flex justify-around py-4 border-y border-slate-100 dark:border-slate-800 mb-4">
                <div className="flex flex-col items-center"><span className="font-bold text-slate-900 dark:text-white">{posts.filter(p => p.userId === currentUser.id).length}</span><span className="text-xs text-slate-500">posts</span></div>
                <div className="flex flex-col items-center"><span className="font-bold text-slate-900 dark:text-white">{currentUser.followers}</span><span className="text-xs text-slate-500">followers</span></div>
                <div className="flex flex-col items-center"><span className="font-bold text-slate-900 dark:text-white">{followingIds.length}</span><span className="text-xs text-slate-500">following</span></div>
            </div>

            <div className="flex border-t border-slate-100 dark:border-slate-800 justify-center gap-16">
                <button 
                  onClick={() => setProfileViewMode('grid')}
                  className={`py-4 flex items-center gap-2 uppercase tracking-widest text-xs font-bold transition-all ${profileViewMode === 'grid' ? 'border-t-2 border-slate-900 dark:border-white text-slate-900 dark:text-white' : 'text-slate-400'}`}
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                  Posts
                </button>
                <button 
                  onClick={() => setProfileViewMode('list')}
                  className={`py-4 flex items-center gap-2 uppercase tracking-widest text-xs font-bold transition-all ${profileViewMode === 'list' ? 'border-t-2 border-slate-900 dark:border-white text-slate-900 dark:text-white' : 'text-slate-400'}`}
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 5h3v3H5zM10 5h3v3h-3zM15 5h3v3h-3zM5 10h3v3H5zM10 10h3v3h-3zM15 10h3v3h-3zM5 15h3v3H5zM10 15h3v3h-3zM15 15h3v3h-3z" /></svg>
                  Tagged
                </button>
            </div>

            {profileViewMode === 'grid' ? (
              <div className="grid grid-cols-3 gap-1">
                {posts.filter(p => p.userId === currentUser.id).length > 0 ? (
                  posts.filter(p => p.userId === currentUser.id).map(post => (
                    <div key={post.id} className="aspect-square bg-slate-100 dark:bg-slate-900 overflow-hidden relative group cursor-pointer">
                      {post.image ? <img src={post.image} className="w-full h-full object-cover" alt="My post" /> : <div className="p-4 flex items-center justify-center text-xs italic">{post.content}</div>}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold">
                         <span className="flex items-center gap-1"><Icons.Heart filled={true} /> {post.likes}</span>
                         <span className="flex items-center gap-1"><Icons.Comment /> {post.comments}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 py-20 text-center text-slate-400 font-medium">No posts yet.</div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 opacity-50">
                <div className="w-16 h-16 border-2 border-slate-900 dark:border-white rounded-full flex items-center justify-center mb-4">
                  <Icons.Profile />
                </div>
                <h3 className="text-xl font-bold dark:text-white">Photos of you</h3>
                <p className="text-sm text-slate-500">When people tag you in photos, they'll appear here.</p>
              </div>
            )}
          </div>
        );

      case AppTab.SETTINGS:
        return <SettingsView settings={settings} onUpdate={updateSettings} />;

      default:
        return <div>Tab not found</div>;
    }
  };

  return (
    <div className={`min-h-screen bg-white dark:bg-slate-950 flex flex-col md:flex-row`}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      
      <main className="flex-1 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 min-h-screen">
        {renderContent()}
      </main>

      <TrendingSidebar followingIds={followingIds} onFollow={toggleFollow} onUnfollow={toggleFollow} />

      {/* Modals */}
      {showEditModal && currentUser && (
        <EditProfileModal 
          user={currentUser} 
          onClose={() => setShowEditModal(false)} 
          onSave={updateProfile} 
        />
      )}

      {/* Floating Action for Creating Post */}
      <button 
        onClick={() => {
          const content = prompt("What's on your mind?");
          const img = prompt("Enter Image URL (optional):");
          if (content || img) {
            setNewPostText(content || "");
            handlePost(img || undefined);
          }
        }}
        className="fixed bottom-24 right-6 md:right-auto md:left-72 md:bottom-12 w-14 h-14 bg-brand-600 text-white rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 z-50 border-2 border-white dark:border-slate-950"
      >
        <Icons.Plus />
      </button>
    </div>
  );
};

export default App;
