import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Profile = 'default' | 'senior' | 'power';
export type DayMode = 'workday' | 'weekend';

interface PrefsState {
  profile: Profile;
  dayMode: DayMode;
  calmScore: number;
  lychees: number;
  openTabs: number;
  zoomLevel: number;
  purchasedItems: Set<string>;
  activeFeatures: Set<string>;
  fortuneCookiesEarned: number;
  setProfile: (profile: Profile) => void;
  setDayMode: (dayMode: DayMode) => void;
  setCalmScore: (score: number) => void;
  incLychees: (amount: number) => void;
  useFortuneCookie: () => void;
  setOpenTabs: (count: number) => void;
  setZoomLevel: (zoom: number) => void;
  incrementCalm: () => void;
  decrementTabs: (amount: number) => void;
  addPurchasedItem: (itemId: string) => void;
  toggleFeature: (featureId: string) => void;
  selectTheme: (themeId: string) => void;
  hasPurchased: (itemId: string) => boolean;
  isFeatureActive: (featureId: string) => boolean;
}

export const usePrefsStore = create<PrefsState>()(
  persist(
    (set, get) => ({
      profile: 'default',
      dayMode: 'workday',
      calmScore: 42,
      lychees: 127,
      openTabs: 23,
      zoomLevel: 1.0,
      purchasedItems: new Set(['base-theme', 'mac-classic']),
      activeFeatures: new Set([]),
      fortuneCookiesEarned: 0,
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
      incLychees: (amount) => set((state) => {
        const newLychees = state.lychees + amount;
        return { lychees: newLychees };
      }),
      useFortuneCookie: () => set((state) => ({
        fortuneCookiesEarned: state.fortuneCookiesEarned + 1
      })),
      setOpenTabs: (count) => set({ openTabs: count }),
      setZoomLevel: (zoom) => set({ zoomLevel: zoom }),
      incrementCalm: () => set((state) => ({ calmScore: state.calmScore + 1 })),
      decrementTabs: (amount) => set((state) => ({
        openTabs: Math.max(0, state.openTabs - amount)
      })),
      addPurchasedItem: (itemId) => set((state) => ({
        purchasedItems: new Set([...state.purchasedItems, itemId])
      })),
      toggleFeature: (featureId) => set((state) => {
        const newActiveFeatures = new Set(state.activeFeatures);
        if (newActiveFeatures.has(featureId)) {
          newActiveFeatures.delete(featureId);
        } else {
          newActiveFeatures.add(featureId);
        }
        return { activeFeatures: newActiveFeatures };
      }),
      selectTheme: (themeId) => set((state) => {
        const newActiveFeatures = new Set(state.activeFeatures);

        // Remove all theme features
        const themes = ['base-theme', 'mac-classic', 'dark-elegance', 'neon-cyber'];
        themes.forEach(theme => newActiveFeatures.delete(theme));

        // Add selected theme (unless it's base-theme which represents no theme)
        if (themeId !== 'base-theme') {
          newActiveFeatures.add(themeId);
        }

        return { activeFeatures: newActiveFeatures };
      }),
      hasPurchased: (itemId) => get().purchasedItems.has(itemId),
      isFeatureActive: (featureId) => get().activeFeatures.has(featureId),
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