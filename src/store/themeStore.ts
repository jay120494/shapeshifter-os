import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  accent: string;
}

export interface CustomTheme {
  id: string;
  name: string;
  description: string;
  cost: number;
  colors: ThemeColors;
  gradient: string;
  category: 'free' | 'premium' | 'pro';
}

interface ThemeState {
  activeTheme: string;
  purchasedThemes: Set<string>;
  setActiveTheme: (themeId: string) => void;
  purchaseTheme: (theme: CustomTheme) => void;
  isPurchased: (themeId: string) => boolean;
  applyTheme: (theme: CustomTheme) => void;
}

const defaultThemes = new Set(['monochrome']);

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      activeTheme: 'monochrome',
      purchasedThemes: defaultThemes,
      
      setActiveTheme: (themeId) => set({ activeTheme: themeId }),
      
      purchaseTheme: (theme) => {
        const { purchasedThemes } = get();
        set({ 
          purchasedThemes: new Set([...purchasedThemes, theme.id]),
          activeTheme: theme.id
        });
      },
      
      isPurchased: (themeId) => get().purchasedThemes.has(themeId),
      
      applyTheme: (theme) => {
        const root = document.documentElement;
        
        // Convert hex to HSL for CSS variables
        const hexToHsl = (hex: string) => {
          const r = parseInt(hex.slice(1, 3), 16) / 255;
          const g = parseInt(hex.slice(3, 5), 16) / 255;
          const b = parseInt(hex.slice(5, 7), 16) / 255;

          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          let h = 0, s = 0;
          const l = (max + min) / 2;

          if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
              case r: h = (g - b) / d + (g < b ? 6 : 0); break;
              case g: h = (b - r) / d + 2; break;
              case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
          }

          return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
        };

        // Apply theme-specific colors
        if (theme.id === 'sunrise') {
          root.style.setProperty('--primary', '14 100% 60%'); // orange-red
          root.style.setProperty('--accent', '35 100% 50%'); // orange
          root.style.setProperty('--gradient-hero', 'linear-gradient(135deg, hsl(14 100% 60%), hsl(35 100% 50%))');
          root.style.setProperty('--gradient-card', 'linear-gradient(145deg, hsl(35 100% 95%), hsl(14 100% 92%))');
        } else if (theme.id === 'midnight') {
          root.style.setProperty('--primary', '220 100% 35%'); // deep blue
          root.style.setProperty('--accent', '270 77% 55%'); // purple
          root.style.setProperty('--gradient-hero', 'linear-gradient(135deg, hsl(220 100% 35%), hsl(270 77% 55%))');
          root.style.setProperty('--gradient-card', 'linear-gradient(145deg, hsl(220 20% 8%), hsl(270 20% 6%))');
          root.style.setProperty('--background', '220 20% 4%');
          root.style.setProperty('--card', '220 15% 6%');
        } else if (theme.id === 'high-contrast-pro') {
          root.style.setProperty('--primary', '120 100% 50%'); // bright green
          root.style.setProperty('--accent', '300 100% 50%'); // magenta
          root.style.setProperty('--gradient-hero', 'linear-gradient(135deg, hsl(120 100% 50%), hsl(300 100% 50%))');
          root.style.setProperty('--background', '0 0% 0%');
          root.style.setProperty('--foreground', '0 0% 100%');
          root.style.setProperty('--card', '0 0% 5%');
        } else {
          // Reset to default monochrome
          root.style.setProperty('--primary', '207 100% 50%'); // Mac Blue
          root.style.setProperty('--accent', '207 100% 50%');
          root.style.setProperty('--gradient-hero', 'linear-gradient(135deg, hsl(207 100% 50%), hsl(283 77% 55%))');
          root.style.setProperty('--gradient-card', 'linear-gradient(145deg, hsl(0 0% 100%), hsl(210 20% 98%))');
        }
      }
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({
        activeTheme: state.activeTheme,
        purchasedThemes: Array.from(state.purchasedThemes)
      }),
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.purchasedThemes)) {
          state.purchasedThemes = new Set(state.purchasedThemes);
        }
      }
    }
  )
);