
import React from 'react';
import { AppTab } from '../types';
import { Icons } from '../constants';

interface SidebarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: AppTab.HOME, label: 'Home', icon: <Icons.Home /> },
    { id: AppTab.EXPLORE, label: 'Explore', icon: <Icons.Search /> },
    { id: AppTab.NOTIFICATIONS, label: 'Notifications', icon: <Icons.Notifications /> },
    { id: AppTab.AI_STUDIO, label: 'AI Studio', icon: <Icons.Sparkles /> },
    { id: AppTab.PROFILE, label: 'Profile', icon: <Icons.Profile /> },
    { id: AppTab.SETTINGS, label: 'Settings', icon: <Icons.Settings /> },
  ];

  return (
    <aside className="fixed bottom-0 left-0 w-full md:relative md:w-72 md:h-screen md:border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 z-50 md:flex md:flex-col md:p-6 transition-all duration-300">
      {/* Logo */}
      <div className="hidden md:flex items-center gap-3 px-4 mb-10 group cursor-pointer" onClick={() => setActiveTab(AppTab.HOME)}>
        <div className="w-12 h-12 bg-brand-600 rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-brand-200 dark:shadow-none transition-transform group-hover:scale-105 group-active:scale-95">
          <span className="text-white font-black text-2xl tracking-tighter">B</span>
        </div>
        <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">Blue</span>
      </div>

      {/* Nav Items */}
      <nav className="flex md:flex-col justify-around md:justify-start items-center md:items-stretch h-16 md:h-auto border-t md:border-t-0 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 md:bg-transparent overflow-x-auto md:overflow-x-visible no-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-4 px-5 py-4 rounded-[1.25rem] transition-all duration-300 flex-shrink-0 md:flex-shrink-1 group ${
              activeTab === item.id
                ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400'
                : 'text-slate-500 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <div className={`transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
              {item.icon}
            </div>
            <span className={`hidden md:block text-lg font-bold tracking-tight`}>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="hidden md:block mt-auto space-y-4">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-5 py-4 text-slate-500 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-2xl transition-all font-bold"
        >
          <Icons.Logout />
          <span className="text-lg">Logout</span>
        </button>
        <button 
          onClick={() => setActiveTab(AppTab.HOME)}
          className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xl rounded-full shadow-2xl shadow-brand-200 dark:shadow-none transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          Post
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
