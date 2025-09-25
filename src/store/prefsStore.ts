import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Profile = 'default' | 'senior' | 'power';
export type DayMode = 'workday' | 'weekend';

interface PrefsState {
  profile: Profile;
  dayMode: DayMode;
  calmScore: number;
  credits: number;
  openTabs: number;
  zoomLevel: number;
  setProfile: (profile: Profile) => void;
  setDayMode: (dayMode: DayMode) => void;
  setCalmScore: (score: number) => void;
  incCredits: (amount: number) => void;
  setOpenTabs: (count: number) => void;
  setZoomLevel: (zoom: number) => void;
  incrementCalm: () => void;
  decrementTabs: (amount: number) => void;
}

export const usePrefsStore = create<PrefsState>()(
  persist(
    (set, get) => ({
      profile: 'default',
      dayMode: 'workday',
      calmScore: 42,
      credits: 127,
      openTabs: 23,
      zoomLevel: 1.0,
      setProfile: (profile) => {
        set({ profile });
        // Auto-set zoom for senior mode
        if (profile === 'senior') {
          set({ zoomLevel: 1.5 });
        } else if (profile === 'power') {
          set({ zoomLevel: 0.9 });
        } else {
          set({ zoomLevel: 1.0 });
        }
        // Apply profile to body
        document.body.setAttribute('data-profile', profile);
      },
      setDayMode: (dayMode) => set({ dayMode }),
      setCalmScore: (score) => set({ calmScore: score }),
      incCredits: (amount) => set((state) => ({ credits: state.credits + amount })),
      setOpenTabs: (count) => set({ openTabs: count }),
      setZoomLevel: (zoom) => set({ zoomLevel: zoom }),
      incrementCalm: () => set((state) => ({ calmScore: state.calmScore + 1 })),
      decrementTabs: (amount) => set((state) => ({ 
        openTabs: Math.max(0, state.openTabs - amount) 
      })),
    }),
    {
      name: 'os-prefs-storage',
      onRehydrateStorage: () => (state) => {
        // Apply profile to body on hydration
        if (state?.profile) {
          document.body.setAttribute('data-profile', state.profile);
        }
      },
    }
  )
);