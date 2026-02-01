
import React, { useState } from 'react';
import { User } from '../types';
import { Icons } from '../constants';

interface EditProfileModalProps {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState<User>({ ...user });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 transition-all duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 border border-slate-200 dark:border-slate-800">
        <header className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between glass sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">Edit Profile</h2>
          </div>
          <button 
            onClick={handleSubmit}
            className="bg-brand-600 dark:bg-brand-500 text-white px-8 py-2.5 rounded-full font-bold hover:bg-brand-700 dark:hover:bg-brand-600 transition-all shadow-lg shadow-brand-200 dark:shadow-none active:scale-95"
          >
            Save
          </button>
        </header>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[80vh] no-scrollbar">
          {/* Banner Edit */}
          <div className="h-44 bg-slate-100 dark:bg-slate-800 relative group cursor-pointer">
            {formData.banner && <img src={formData.banner} className="w-full h-full object-cover" alt="Banner" />}
            <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
               <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white">
                 <Icons.Camera />
               </div>
            </div>
            {/* Avatar Edit */}
            <div className="absolute -bottom-12 left-8 w-28 h-28 rounded-full ring-8 ring-white dark:ring-slate-900 overflow-hidden bg-slate-200 dark:bg-slate-800 group/avatar cursor-pointer shadow-xl">
               <img src={formData.avatar} className="w-full h-full object-cover transition-transform group-hover/avatar:scale-110" alt="Avatar" />
               <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all duration-300">
                  <div className="text-white">
                    <Icons.Camera />
                  </div>
               </div>
            </div>
          </div>

          <div className="pt-16 px-8 pb-10 space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.1em] ml-1">Full Name</label>
              <input 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:border-brand-400 outline-none transition-all dark:text-white"
                placeholder="Your full name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.1em] ml-1">Bio</label>
              <textarea 
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:border-brand-400 outline-none transition-all resize-none dark:text-white"
                placeholder="Tell the world about yourself..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.1em] ml-1">Location</label>
                <input 
                  name="location"
                  value={formData.location || ''}
                  onChange={handleChange}
                  placeholder="San Francisco, CA"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.1em] ml-1">Website</label>
                <input 
                  name="website"
                  value={formData.website || ''}
                  onChange={handleChange}
                  placeholder="example.com"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all dark:text-white"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
