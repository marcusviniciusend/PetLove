import { create } from 'zustand';
import { Profile } from '../types';

interface AuthState {
  userId: string | null;
  profile: Profile | null;
  setUserId: (id: string | null) => void;
  setProfile: (profile: Profile | null) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  profile: null,
  setUserId: (userId) => set({ userId }),
  setProfile: (profile) => set({ profile }),
  reset: () => set({ userId: null, profile: null }),
}));
