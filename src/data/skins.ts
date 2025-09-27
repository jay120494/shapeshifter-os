
import { CustomTheme } from '@/store/themeStore';

export const SKINS: CustomTheme[] = [
  {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Clean, minimal black and white aesthetic',
    cost: 0,
    colors: {
      primary: '#007AFF',
      secondary: '#8E8E93',
      background: '#ffffff',
      accent: '#007AFF'
    },
    gradient: 'linear-gradient(135deg, #000000, #333333)',
    category: 'free'
  },
  {
    id: 'sunrise',
    name: 'Sunrise',
    description: 'Warm oranges and pinks for morning productivity',
    cost: 25,
    colors: {
      primary: '#ff6b35',
      secondary: '#ffaa00',
      background: '#fff8f0',
      accent: '#ff8c42'
    },
    gradient: 'linear-gradient(135deg, #ff6b35, #ffaa00, #ff8c42)',
    category: 'premium'
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Deep blues and purples for focus',
    cost: 30,
    colors: {
      primary: '#1a365d',
      secondary: '#553c9a',
      background: '#0f1419',
      accent: '#4299e1'
    },
    gradient: 'linear-gradient(135deg, #1a365d, #553c9a, #4299e1)',
    category: 'premium'
  },
  {
    id: 'high-contrast-pro',
    name: 'High-Contrast Pro',
    description: 'Maximum accessibility with vibrant highlights',
    cost: 50,
    colors: {
      primary: '#00ff00',
      secondary: '#ffff00',
      background: '#000000',
      accent: '#ff00ff'
    },
    gradient: 'linear-gradient(135deg, #00ff00, #ffff00, #ff00ff)',
    category: 'pro'
  },
  {
    id: 'bao-garden',
    name: 'Bao Garden',
    description: 'Serene garden palette with soft blossoms',
    cost: 35,
    colors: {
      primary: '#FF7AA2',
      secondary: '#86EFAC',
      background: '#FFF5F7',
      accent: '#FDE68A'
    },
    gradient: 'linear-gradient(135deg, #ffb6c1, #fde68a, #86efac)',
    category: 'premium'
  },
  {
    id: 'dim-sum-delight',
    name: 'Dim Sum Delight',
    description: 'Toasty bamboo neutrals with glowing highlights',
    cost: 40,
    colors: {
      primary: '#D97706',
      secondary: '#92400E',
      background: '#FFF7ED',
      accent: '#FBBF24'
    },
    gradient: 'linear-gradient(135deg, #fbe7c6, #f59e0b, #92400e)',
    category: 'premium'
  }
];
