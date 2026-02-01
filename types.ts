
export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  banner?: string;
  email?: string;
  bio?: string;
  location?: string;
  website?: string;
  joinDate?: string;
  followers: number;
  following: number;
  isPrivate?: boolean;
}

export interface UserSettings {
  darkMode: boolean;
  aiAutoEnhance: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  contentFilter: 'standard' | 'strict' | 'relaxed';
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userHandle: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  reblues: number;
  image?: string;
  isAiGenerated?: boolean;
}

export enum AppTab {
  HOME = 'home',
  EXPLORE = 'explore',
  NOTIFICATIONS = 'notifications',
  PROFILE = 'profile',
  AI_STUDIO = 'ai_studio',
  SETTINGS = 'settings'
}
