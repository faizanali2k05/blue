
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

    setIsLoading(false);
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
      banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=60'
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

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div></div>;

  if (!currentUser) return <Auth onLogin={handleLogin} />;

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.HOME:
        return (
          <div className="flex flex-col dark:bg-slate-950">
            <header className="sticky top-0 z-40 h-16 glass border-b border-slate-100 dark:border-slate-800 px-6 flex items-center justify-between">
              <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Home</h1>
              <div className="md:hidden w-8 h-8 rounded-full overflow-hidden" onClick={() => setActiveTab(AppTab.PROFILE)}>
                <img src={currentUser.avatar} alt="Me" className="w-full h-full object-cover" />
              </div>
            </header>

            {/* Post Composer */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950">
              <div className="flex gap-4">
                <img src={currentUser.avatar} className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800" alt="Me" />
                <div className="flex-1">
                  <textarea
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                    placeholder="What's happening in your world?"
                    className="w-full bg-transparent border-none focus:ring-0 text-xl resize-none placeholder-slate-400 dark:placeholder-slate-600 min-h-[100px] dark:text-slate-100 font-medium"
                  />
                  
                  {generatedImage && (
                    <div className="relative mt-4 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 group shadow-lg">
                      <img src={generatedImage} alt="AI Generated" className="w-full h-auto" />
                      <button 
                        onClick={() => setGeneratedImage(null)}
                        className="absolute top-4 right-4 p-2 bg-slate-900/40 backdrop-blur-md text-white rounded-full hover:bg-slate-900 transition-all active:scale-90"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}

                  <div className="mt-6 flex items-center justify-between border-t border-slate-50 dark:border-slate-900 pt-5">
                    <div className="flex gap-3">
                      <button 
                        onClick={generateAiContent}
                        disabled={isGenerating || !newPostText}
                        className={`p-3 rounded-2xl transition-all ${isGenerating ? 'animate-pulse bg-brand-100 dark:bg-brand-900/50 text-brand-600' : 'hover:bg-brand-50 dark:hover:bg-brand-950/30 text-brand-600 dark:text-brand-400'}`}
                        title="AI Enhance"
                      >
                        <Icons.Sparkles />
                      </button>
                      <button 
                        onClick={generateAiImage}
                        disabled={isImageGenerating || !newPostText}
                        className={`p-3 rounded-2xl transition-all ${isImageGenerating ? 'animate-pulse bg-purple-100 dark:bg-purple-900/50 text-purple-600' : 'hover:bg-purple-50 dark:hover:bg-purple-950/30 text-purple-600 dark:text-purple-400'}`}
                        title="Generate Image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                      </button>
                    </div>
                    <button 
                      onClick={handlePost}
                      disabled={!newPostText.trim() && !generatedImage}
                      className="bg-brand-600 dark:bg-brand-500 disabled:opacity-50 text-white font-black px-8 py-3 rounded-full hover:bg-brand-700 dark:hover:bg-brand-600 transition-all shadow-xl shadow-brand-200 dark:shadow-none active:scale-95 text-lg"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Feed */}
            <div className="flex flex-col bg-white dark:bg-slate-950 min-h-screen">
              {posts.length === 0 ? (
                <div className="p-20 text-center text-slate-400 dark:text-slate-600">
                  <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 border border-slate-100 dark:border-slate-800">
                    <Icons.Home />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-slate-200">Silence is over.</h3>
                  <p className="mt-3 text-lg font-medium">Start the conversation on Blue today.</p>
                </div>
              ) : (
                posts.map(post => <PostCard key={post.id} post={post} />)
              )}
            </div>
          </div>
        );

      case AppTab.EXPLORE:
        return (
          <div className="p-6 dark:bg-slate-950 min-h-screen">
            <h1 className="text-3xl font-black mb-6 dark:text-white tracking-tight">Explore</h1>
            <div className="relative mb-8 group">
               <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors"><Icons.Search /></span>
               <input 
                type="text" 
                placeholder="Search the Blue verse" 
                className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-full py-4 pl-14 pr-6 focus:ring-4 focus:ring-brand-500/10 dark:focus:ring-brand-500/20 text-lg transition-all dark:text-white"
               />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1,2,3,4,5,6,7,8,9].map(i => (
                <div key={i} className="aspect-square rounded-3xl overflow-hidden bg-slate-200 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-sm">
                  <img src={`https://picsum.photos/id/${i+120}/600/600`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 cursor-pointer" alt="Explore" />
                </div>
              ))}
            </div>
          </div>
        );

      case AppTab.SETTINGS:
        return <SettingsView settings={settings} onUpdate={updateSettings} />;

      case AppTab.PROFILE:
        return (
          <div className="flex flex-col dark:bg-slate-950 min-h-screen">
            <div className="h-56 bg-slate-200 dark:bg-slate-800 relative">
              <img src={currentUser.banner} className="w-full h-full object-cover" alt="Banner" />
              <div className="absolute -bottom-16 left-6 ring-8 ring-white dark:ring-slate-950 rounded-full overflow-hidden w-36 h-36 bg-slate-200 dark:bg-slate-800 shadow-2xl">
                <img src={currentUser.avatar} className="w-full h-full object-cover transition-transform hover:scale-110 duration-500" alt="Profile" />
              </div>
            </div>
            <div className="pt-20 px-6 pb-6 border-b border-slate-100 dark:border-slate-900">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{currentUser.name}</h2>
                  <p className="text-slate-500 dark:text-slate-500 font-bold text-lg">{currentUser.handle}</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setActiveTab(AppTab.SETTINGS)}
                    className="p-3 border-2 border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 transition-all active:scale-95"
                  >
                    <Icons.Settings />
                  </button>
                  <button 
                    onClick={() => setShowEditModal(true)}
                    className="border-2 border-slate-200 dark:border-slate-800 px-8 py-3 rounded-full font-black text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all flex items-center gap-2.5 active:scale-95 shadow-sm"
                  >
                    <Icons.Edit />
                    Edit Profile
                  </button>
                </div>
              </div>
              <p className="mt-5 text-slate-800 dark:text-slate-300 leading-relaxed max-w-xl text-lg font-medium">{currentUser.bio}</p>
              
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5 text-sm font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">
                 {currentUser.location && (
                   <span className="flex items-center gap-1.5">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                      </svg>
                     {currentUser.location}
                   </span>
                 )}
                 {currentUser.website && (
                    <a href={`https://${currentUser.website}`} target="_blank" className="text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                      </svg>
                      {currentUser.website}
                    </a>
                 )}
                 <span className="flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                    Joined {currentUser.joinDate}
                 </span>
              </div>

              <div className="flex gap-6 mt-6">
                <button className="text-base hover:underline"><span className="font-black text-slate-900 dark:text-white">{currentUser.following}</span> <span className="text-slate-500 font-bold">Following</span></button>
                <button className="text-base hover:underline"><span className="font-black text-slate-900 dark:text-white">{currentUser.followers}</span> <span className="text-slate-500 font-bold">Followers</span></button>
              </div>
            </div>
            <div className="flex border-b border-slate-100 dark:border-slate-900 sticky top-16 glass z-10">
               {['Posts', 'Replies', 'Media', 'Likes'].map((tab, idx) => (
                 <button key={tab} className={`flex-1 py-5 text-sm font-black tracking-widest uppercase transition-all ${idx === 0 ? 'border-b-4 border-brand-600 text-brand-600 dark:text-brand-400' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900/50'}`}>
                   {tab}
                 </button>
               ))}
            </div>
            <div className="flex flex-col bg-white dark:bg-slate-950 pb-20">
              {posts.filter(p => p.userId === currentUser.id).length === 0 ? (
                 <div className="p-20 text-center text-slate-400 dark:text-slate-600">
                    <p className="text-lg font-bold">Your story hasn't started yet.</p>
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
        return <div>Tab not found</div>;
    }
  };

  return (
    <div className={`min-h-screen bg-white dark:bg-slate-950 max-w-7xl mx-auto flex flex-col md:flex-row pb-16 md:pb-0 transition-colors duration-300`}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      
      <main className="flex-1 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 min-h-screen">
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
        className="fixed bottom-24 right-6 w-16 h-16 bg-brand-600 dark:bg-brand-500 text-white rounded-[1.75rem] flex items-center justify-center shadow-2xl md:hidden transition-all active:scale-90 z-50 border-4 border-white dark:border-slate-900"
      >
        <Icons.Plus />
      </button>
    </div>
  );
};

export default App;
