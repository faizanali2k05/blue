
import React from 'react';
import { UserSettings } from '../types';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdate: (newSettings: Partial<UserSettings>) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ settings, onUpdate }) => {
  const Toggle = ({ active, onClick }: { active: boolean, onClick: () => void }) => (
    <button 
      onClick={onClick}
      className={`w-14 h-8 rounded-full transition-all duration-300 relative flex items-center px-1 ${active ? 'bg-brand-600 shadow-inner' : 'bg-slate-200 dark:bg-slate-700'}`}
    >
      <div className={`w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-md ${active ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
  );

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-12 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm font-medium">Personalize your Blue experience.</p>
      </header>

      <section className="space-y-6">
        <h2 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800 pb-3">Appearance</h2>
        <div className="space-y-8">
          <div className="flex items-center justify-between group">
            <div className="max-w-[70%]">
              <p className="font-bold text-slate-900 dark:text-slate-200 text-sm">Dark Mode</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Switch between light and dark themes.</p>
            </div>
            <Toggle active={settings.darkMode} onClick={() => onUpdate({ darkMode: !settings.darkMode })} />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800 pb-3">Notifications</h2>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-200 text-sm">Email Alerts</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Weekly summaries and important account news.</p>
            </div>
            <Toggle active={settings.emailNotifications} onClick={() => onUpdate({ emailNotifications: !settings.emailNotifications })} />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-200 text-sm">Push Notifications</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Instant updates for likes, comments, and saves.</p>
            </div>
            <Toggle active={settings.pushNotifications} onClick={() => onUpdate({ pushNotifications: !settings.pushNotifications })} />
          </div>
        </div>
      </section>

      <div className="pt-12 flex flex-col gap-4">
        <button className="w-full py-4 text-rose-600 dark:text-rose-500 font-bold text-sm hover:underline">
          Delete Account
        </button>
        <p className="text-center text-[10px] text-slate-300 dark:text-slate-700 font-black tracking-widest uppercase">Blue v2.0 • Pure Connection</p>
      </div>
    </div>
  );
};

export default SettingsView;
