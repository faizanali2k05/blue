
import React, { useState } from 'react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would hit an API. 
    // Here we simulate successful auth and persist to localStorage.
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: name || 'Blue User',
      handle: handle.startsWith('@') ? handle : `@${handle || 'user'}`,
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      bio: 'New explorer on Blue. AI is the future! 🌊',
      followers: 0,
      following: 0
    };

    localStorage.setItem('blue_user', JSON.stringify(user));
    onLogin(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-blue-100 p-8 border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 mb-4">
            <span className="text-white font-bold text-3xl">B</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome to Blue</h1>
          <p className="text-slate-500 mt-2">The future of social is AI-enhanced.</p>
        </div>

        <div className="flex mb-8 bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Login
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Username</label>
                <input 
                  type="text" 
                  required
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="@janedoe"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                />
              </div>
            </>
          )}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] mt-4"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-slate-400">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Auth;
