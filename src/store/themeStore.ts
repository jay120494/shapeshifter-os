
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

type RGB = { r: number; g: number; b: number };
type HSL = { h: number; s: number; l: number };

interface ThemeState {
  activeTheme: string;
  purchasedThemes: Set<string>;
  setActiveTheme: (themeId: string) => void;
  purchaseTheme: (theme: CustomTheme) => void;
  isPurchased: (themeId: string) => boolean;
  applyTheme: (theme: CustomTheme) => void;
  resetTheme: () => void;
}

const defaultThemes = new Set(['monochrome']);

const themeVariableKeys = [
  '--background',
  '--foreground',
  '--card',
  '--card-foreground',
  '--popover',
  '--popover-foreground',
  '--primary',
  '--primary-foreground',
  '--secondary',
  '--secondary-foreground',
  '--muted',
  '--muted-foreground',
  '--accent',
  '--accent-foreground',
  '--destructive',
  '--destructive-foreground',
  '--border',
  '--input',
  '--ring',
  '--gradient-hero',
  '--gradient-card'
];

const clamp = (value: number, min = 0, max = 100) => Math.min(Math.max(value, min), max);

const hexToRgb = (hex: string): RGB => {
  let normalized = hex.replace('#', '');
  if (normalized.length === 3) {
    normalized = normalized
      .split('')
      .map((char) => char + char)
      .join('');
  }
  const value = parseInt(normalized, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255
  };
};

const rgbToHsl = (r: number, g: number, b: number): HSL => {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case rn:
        h = (gn - bn) / d + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      default:
        h = (rn - gn) / d + 4;
        break;
    }

    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
};

const hexToHsl = (hex: string): HSL => {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHsl(r, g, b);
};

const hslToCss = ({ h, s, l }: HSL) => `${h} ${s}% ${l}%`;

const hslToFunctional = ({ h, s, l }: HSL, alpha?: number) => alpha !== undefined ? `hsl(${h} ${s}% ${l}% / ${alpha})` : `hsl(${h} ${s}% ${l}%)`;

const adjustLightness = (hsl: HSL, amount: number): HSL => ({
  h: hsl.h,
  s: hsl.s,
  l: clamp(hsl.l + amount)
});

const channelToLuminance = (channel: number) => {
  const normalized = channel / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : Math.pow((normalized + 0.055) / 1.055, 2.4);
};

const relativeLuminance = (hex: string) => {
  const { r, g, b } = hexToRgb(hex);
  const R = channelToLuminance(r);
  const G = channelToLuminance(g);
  const B = channelToLuminance(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};

const pickForegroundHex = (hex: string) => (relativeLuminance(hex) > 0.55 ? '#111827' : '#f8fafc');

const createThemeOverrides = (theme: CustomTheme): Record<string, string> => {
  const background = hexToHsl(theme.colors.background);
  const primary = hexToHsl(theme.colors.primary);
  const secondary = hexToHsl(theme.colors.secondary);
  const accent = hexToHsl(theme.colors.accent);

  const baseForeground = hexToHsl(pickForegroundHex(theme.colors.background));
  const primaryForeground = hexToHsl(pickForegroundHex(theme.colors.primary));
  const secondaryForeground = hexToHsl(pickForegroundHex(theme.colors.secondary));
  const accentForeground = hexToHsl(pickForegroundHex(theme.colors.accent));

  const backgroundIsLight = background.l >= 55;

  const card = adjustLightness(background, backgroundIsLight ? -6 : 10);
  const popover = adjustLightness(background, backgroundIsLight ? -8 : 12);
  const muted = adjustLightness(background, backgroundIsLight ? -3 : 8);
  const border = adjustLightness(background, backgroundIsLight ? -22 : 16);
  const input = adjustLightness(background, backgroundIsLight ? -10 : 12);

  const mutedForeground = adjustLightness(baseForeground, baseForeground.l > 50 ? -20 : 18);

  const gradientCard = `linear-gradient(145deg, ${hslToFunctional(adjustLightness(background, backgroundIsLight ? -2 : 6), backgroundIsLight ? 0.94 : 0.9)}, ${hslToFunctional(card)})`;

  return {
    '--background': hslToCss(background),
    '--foreground': hslToCss(baseForeground),
    '--card': hslToCss(card),
    '--card-foreground': hslToCss(baseForeground),
    '--popover': hslToCss(popover),
    '--popover-foreground': hslToCss(baseForeground),
    '--primary': hslToCss(primary),
    '--primary-foreground': hslToCss(primaryForeground),
    '--secondary': hslToCss(secondary),
    '--secondary-foreground': hslToCss(secondaryForeground),
    '--accent': hslToCss(accent),
    '--accent-foreground': hslToCss(accentForeground),
    '--muted': hslToCss(muted),
    '--muted-foreground': hslToCss(mutedForeground),
    '--border': hslToCss(border),
    '--input': hslToCss(input),
    '--ring': hslToCss(primary),
    '--gradient-hero': theme.gradient,
    '--gradient-card': gradientCard
  };
};

const clearThemeStyles = () => {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;
  themeVariableKeys.forEach((key) => {
    root.style.removeProperty(key);
  });
  root.removeAttribute('data-theme');
  root.removeAttribute('data-skin');
};

const applyThemeStyles = (theme: CustomTheme) => {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;
  themeVariableKeys.forEach((key) => {
    root.style.removeProperty(key);
  });

  if (theme.id === 'monochrome') {
    clearThemeStyles();
    return;
  }

  const overrides = createThemeOverrides(theme);
  root.setAttribute('data-theme', theme.id);
  root.setAttribute('data-skin', theme.id);

  Object.entries(overrides).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};

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
        if (!theme) {
          return;
        }
        applyThemeStyles(theme);
      },

      resetTheme: () => {
        clearThemeStyles();
        set({ activeTheme: 'monochrome' });
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
