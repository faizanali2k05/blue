
import React, { useState, useEffect } from 'react';
import { AppTab, Post, User, UserSettings } from './types';
import { Icons } from './constants';
import Sidebar from './components/Sidebar';
import PostCard from './components/PostCard';
import TrendingSidebar from './components/TrendingSidebar';
import Auth from './components/Auth';
import EditProfileModal from './components/EditProfileModal';
import SettingsView from './components/SettingsView';
import { GeminiService } from './services/geminiService';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<UserSettings>({
    darkMode: false,
    aiAutoEnhance: true,
    emailNotifications: true,
    pushNotifications: true,
    contentFilter: 'standard'
  });
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostText, setNewPostText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImageGenerating, setIsImageGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  // Initialize Auth & Data
  useEffect(() => {
    const savedUser = localStorage.getItem('blue_user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));

    const savedPosts = localStorage.getItem('blue_posts');
    if (savedPosts) setPosts(JSON.parse(savedPosts));

    const savedSettings = localStorage.getItem('blue_settings');
    if (savedSettings) setSettings(JSON.parse(savedSettings));

    setTimeout(() => setIsLoading(false), 800);
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (posts.length > 0) localStorage.setItem('blue_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    if (currentUser) localStorage.setItem('blue_user', JSON.stringify(currentUser));
  }, [currentUser]);

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
      banner: undefined
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

  const handlePost = () => {
    if (!currentUser || (!newPostText.trim() && !generatedImage)) return;

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
      image: generatedImage || undefined,
      isAiGenerated: isGenerating || isImageGenerating
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
    setGeneratedImage(null);
  };

  const generateAiContent = async () => {
    if (!newPostText) return;
    setIsGenerating(true);
    const gemini = GeminiService.getInstance();
    const result = await gemini.generatePostContent(newPostText);
    setNewPostText(result);
    setIsGenerating(false);
  };

  const generateAiImage = async () => {
    if (!newPostText) return;
    setIsImageGenerating(true);
    const gemini = GeminiService.getInstance();
    const img = await gemini.generatePostImage(newPostText);
    setGeneratedImage(img);
    setIsImageGenerating(false);
  };

  if (isLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="w-16 h-16 bg-brand-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl animate-bounce mb-6">
        <span className="text-white font-black text-3xl">B</span>
      </div>
      <div className="w-48 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-brand-500 w-1/2 animate-[shimmer_2s_infinite_linear] rounded-full"></div>
      </div>
    </div>
  );

  if (!currentUser) return <Auth onLogin={handleLogin} />;

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.HOME:
        return (
          <div className="flex flex-col dark:bg-slate-950">
            <header className="sticky top-0 z-40 h-[70px] glass border-b border-slate-100 dark:border-slate-800/50 px-8 flex items-center justify-between">
              <h1 className="text-2xl font-[900] tracking-tighter text-slate-900 dark:text-white">Home</h1>
              <div className="md:hidden w-10 h-10 rounded-xl overflow-hidden shadow-premium border-2 border-white dark:border-slate-800" onClick={() => setActiveTab(AppTab.PROFILE)}>
                <img src={currentUser.avatar} alt="Me" className="w-full h-full object-cover" />
              </div>
            </header>

            {/* Post Composer */}
            <div className="p-8 border-b border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950">
              <div className="flex gap-5">
                <img src={currentUser.avatar} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800 shadow-sm" alt="Me" />
                <div className="flex-1">
                  <textarea
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                    placeholder="What's your story?"
                    className="w-full bg-transparent border-none focus:ring-0 text-xl resize-none placeholder-slate-400 dark:placeholder-slate-600 min-h-[120px] dark:text-slate-100 font-medium tracking-tight"
                  />
                  
                  {generatedImage && (
                    <div className="relative mt-6 rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 group shadow-premium ring-4 ring-slate-50 dark:ring-slate-900">
                      <img src={generatedImage} alt="AI Generated" className="w-full h-auto" />
                      <button 
                        onClick={() => setGeneratedImage(null)}
                        className="absolute top-5 right-5 p-3 bg-slate-950/40 backdrop-blur-xl text-white rounded-2xl hover:bg-slate-950 hover:scale-110 transition-all active:scale-90 shadow-xl"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}

                  <div className="mt-8 flex items-center justify-between border-t border-slate-100 dark:border-slate-900 pt-6">
                    <div className="flex gap-4">
                      <button 
                        onClick={generateAiContent}
                        disabled={isGenerating || !newPostText}
                        className={`p-3.5 rounded-2xl transition-all border border-transparent ${isGenerating ? 'animate-pulse bg-brand-50 dark:bg-brand-900/40 text-brand-600' : 'hover:bg-brand-50 dark:hover:bg-brand-900/30 text-brand-600 dark:text-brand-400 hover:border-brand-200 dark:hover:border-brand-800'}`}
                        title="Enhance Draft"
                      >
                        <Icons.Sparkles />
                      </button>
                      <button 
                        onClick={generateAiImage}
                        disabled={isImageGenerating || !newPostText}
                        className={`p-3.5 rounded-2xl transition-all border border-transparent ${isImageGenerating ? 'animate-pulse bg-purple-50 dark:bg-purple-900/40 text-purple-600' : 'hover:bg-purple-50 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:border-purple-200 dark:hover:border-purple-800'}`}
                        title="AI Image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                      </button>
                    </div>
                    <button 
                      onClick={handlePost}
                      disabled={!newPostText.trim() && !generatedImage}
                      className="bg-brand-600 dark:bg-brand-500 disabled:opacity-40 text-white font-black px-10 py-4 rounded-full hover:bg-brand-700 dark:hover:bg-brand-600 transition-all shadow-xl shadow-brand-200 dark:shadow-none active:scale-95 text-lg flex items-center gap-2 group"
                    >
                      Post
                      <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Feed */}
            <div className="flex flex-col bg-white dark:bg-slate-950 min-h-screen">
              {posts.length === 0 ? (
                <div className="p-24 text-center">
                  <div className="w-32 h-32 bg-slate-50 dark:bg-slate-900 rounded-[3rem] flex items-center justify-center mx-auto mb-10 border-4 border-white dark:border-slate-800 shadow-premium">
                    <div className="text-brand-500 scale-[2]">
                      <Icons.Home />
                    </div>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Your timeline is quiet.</h3>
                  <p className="mt-4 text-slate-500 dark:text-slate-400 text-lg font-medium max-w-sm mx-auto leading-relaxed">Join the conversation and be the first to share something amazing!</p>
                  <button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="mt-8 text-brand-600 dark:text-brand-400 font-black tracking-wider uppercase text-xs hover:underline">Start Posting</button>
                </div>
              ) : (
                posts.map(post => <PostCard key={post.id} post={post} />)
              )}
            </div>
          </div>
        );

      case AppTab.EXPLORE:
        return (
          <div className="p-8 dark:bg-slate-950 min-h-screen">
            <h1 className="text-4xl font-[900] mb-8 dark:text-white tracking-tighter">Explore</h1>
            <div className="relative mb-10 group max-w-2xl">
               <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-all scale-110"><Icons.Search /></span>
               <input 
                type="text" 
                placeholder="Search the Blue Verse..." 
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] py-5 pl-16 pr-8 focus:ring-4 focus:ring-brand-500/10 dark:focus:ring-brand-500/20 text-xl transition-all dark:text-white shadow-sm font-medium"
               />
            </div>
            
            <div className="flex flex-col items-center justify-center p-20 text-center opacity-40">
              <Icons.Search />
              <h3 className="mt-4 text-xl font-black italic tracking-tight">Search for trending topics and people.</h3>
            </div>
          </div>
        );

      case AppTab.SETTINGS:
        return <SettingsView settings={settings} onUpdate={updateSettings} />;

      case AppTab.PROFILE:
        return (
          <div className="flex flex-col dark:bg-slate-950 min-h-screen">
            <div className="h-64 bg-slate-200 dark:bg-slate-800 relative">
              {currentUser.banner && <img src={currentUser.banner} className="w-full h-full object-cover" alt="Banner" />}
              <div className="absolute -bottom-16 left-8 ring-[10px] ring-white dark:ring-slate-950 rounded-[3rem] overflow-hidden w-40 h-40 bg-slate-200 dark:bg-slate-800 shadow-premium group cursor-pointer">
                <img src={currentUser.avatar} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt="Profile" />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <Icons.Camera />
                </div>
              </div>
            </div>
            <div className="pt-24 px-8 pb-8 border-b border-slate-100 dark:border-slate-900">
              <div className="flex justify-between items-start">
                <div className="min-w-0 flex-1">
                  <h2 className="text-4xl font-[900] text-slate-900 dark:text-white tracking-tighter truncate">{currentUser.name}</h2>
                  <p className="text-slate-400 dark:text-slate-500 font-black text-xl tracking-tight mt-1">{currentUser.handle}</p>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setActiveTab(AppTab.SETTINGS)}
                    className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all active:scale-95 shadow-sm border border-slate-200/50 dark:border-slate-800"
                  >
                    <Icons.Settings />
                  </button>
                  <button 
                    onClick={() => setShowEditModal(true)}
                    className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 px-8 py-3 rounded-full font-black text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-3 active:scale-95 shadow-premium"
                  >
                    <Icons.Edit />
                    Edit Profile
                  </button>
                </div>
              </div>
              <p className="mt-6 text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl text-[1.1rem] font-medium">{currentUser.bio}</p>
              
              <div className="flex flex-wrap gap-x-8 gap-y-3 mt-6 text-xs font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.15em]">
                 {currentUser.location && (
                   <span className="flex items-center gap-2">
                     <svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                     {currentUser.location}
                   </span>
                 )}
                 {currentUser.website && (
                    <a href={`https://${currentUser.website}`} target="_blank" className="text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" /></svg>
                      {currentUser.website}
                    </a>
                 )}
                 <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2V7" /></svg>
                    Joined {currentUser.joinDate}
                 </span>
              </div>

              <div className="flex gap-8 mt-8">
                <button className="text-lg hover:underline"><span className="font-black text-slate-900 dark:text-white">{currentUser.following}</span> <span className="text-slate-400 dark:text-slate-500 font-bold ml-1">Following</span></button>
                <button className="text-lg hover:underline"><span className="font-black text-slate-900 dark:text-white">{currentUser.followers}</span> <span className="text-slate-400 dark:text-slate-500 font-bold ml-1">Followers</span></button>
              </div>
            </div>
            <div className="flex border-b border-slate-100 dark:border-slate-900 sticky top-[70px] glass z-10 no-scrollbar overflow-x-auto">
               {['Posts', 'Replies', 'Media', 'Likes'].map((tab, idx) => (
                 <button key={tab} className={`flex-1 py-6 text-[11px] font-black tracking-[0.2em] uppercase transition-all min-w-[100px] ${idx === 0 ? 'border-b-4 border-brand-600 text-brand-600 dark:text-brand-400' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50'}`}>
                   {tab}
                 </button>
               ))}
            </div>
            <div className="flex flex-col bg-white dark:bg-slate-950 pb-24">
              {posts.filter(p => p.userId === currentUser.id).length === 0 ? (
                 <div className="p-24 text-center opacity-40">
                    <p className="text-xl font-black italic tracking-tight">Your digital footprint starts here.</p>
                 </div>
              ) : (
                posts.filter(p => p.userId === currentUser.id).map(post => (
                  <PostCard key={post.id} post={post} />
                ))
              )}
            </div>
          </div>
        );

      default:
        return <div className="p-20 text-center font-black opacity-30">404 - LOST IN THE BLUE</div>;
    }
  };

  return (
    <div className={`min-h-screen bg-[#f8fafc] dark:bg-slate-950 max-w-7xl mx-auto flex flex-col md:flex-row pb-16 md:pb-0 transition-colors duration-500`}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      
      <main className="flex-1 border-r border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-950 min-h-screen shadow-sm">
        {renderContent()}
      </main>

      <TrendingSidebar />

      {/* Modals */}
      {showEditModal && currentUser && (
        <EditProfileModal 
          user={currentUser} 
          onClose={() => setShowEditModal(false)} 
          onSave={updateProfile} 
        />
      )}

      {/* Mobile FAB for posting */}
      <button 
        onClick={() => { setActiveTab(AppTab.HOME); window.scrollTo({top: 0, behavior: 'smooth'}); }}
        className="fixed bottom-28 right-8 w-16 h-16 bg-brand-600 dark:bg-brand-500 text-white rounded-[1.75rem] flex items-center justify-center shadow-2xl md:hidden transition-all active:scale-90 z-50 border-4 border-white dark:border-slate-900 group"
      >
        <div className="group-hover:rotate-90 transition-transform duration-300">
          <Icons.Plus />
        </div>
      </button>
    </div>
  );
};

export default App;
