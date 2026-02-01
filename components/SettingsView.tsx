
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
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Personalize your Blue experience.</p>
      </header>

      <section className="space-y-6">
        <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-3">General</h2>
        <div className="space-y-8">
          <div className="flex items-center justify-between group">
            <div className="max-w-[70%]">
              <p className="font-bold text-slate-900 dark:text-slate-200">Dark Mode</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Switch between light and dark themes.</p>
            </div>
            <Toggle active={settings.darkMode} onClick={() => onUpdate({ darkMode: !settings.darkMode })} />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="max-w-[70%]">
              <p className="font-bold text-slate-900 dark:text-slate-200">AI Auto-Enhance</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Let Gemini optimize your drafts for better engagement.</p>
            </div>
            <Toggle active={settings.aiAutoEnhance} onClick={() => onUpdate({ aiAutoEnhance: !settings.aiAutoEnhance })} />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-3">Notifications</h2>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-200">Email Alerts</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Weekly summaries and important account news.</p>
            </div>
            <Toggle active={settings.emailNotifications} onClick={() => onUpdate({ emailNotifications: !settings.emailNotifications })} />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-200">Push Notifications</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Instant updates for likes, comments, and reblues.</p>
            </div>
            <Toggle active={settings.pushNotifications} onClick={() => onUpdate({ pushNotifications: !settings.pushNotifications })} />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-3">Safety</h2>
        <div className="space-y-4">
          <p className="font-bold text-slate-900 dark:text-slate-200">Content Filtering</p>
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            {['Standard', 'Strict', 'Relaxed'].map(type => (
              <button 
                key={type}
                onClick={() => onUpdate({ contentFilter: type.toLowerCase() as any })}
                className={`py-3 text-sm font-bold rounded-xl transition-all ${settings.contentFilter === type.toLowerCase() ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm' : 'text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="pt-12 flex flex-col gap-4">
        <button className="w-full py-5 bg-slate-50 dark:bg-slate-900 text-rose-600 dark:text-rose-500 font-extrabold rounded-3xl hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all border border-slate-200 dark:border-slate-800">
          Deactivate Account
        </button>
        <p className="text-center text-sm text-slate-400 dark:text-slate-600 font-medium tracking-tight">Blue v1.2.4-beta • Built with Gemini</p>
      </div>
    </div>
  );
};

export default SettingsView;
