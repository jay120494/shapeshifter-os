import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  Palette, 
  Crown, 
  Zap, 
  Moon, 
  Sun, 
  Sparkles, 
  Check, 
  Mic, 
  Volume2, 
  Headphones,
  Image,
  Wand2,
  Brain,
  Gamepad2,
  Heart,
  Star,
  Layers,
  Settings,
  Clock,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SKINS } from '@/data/skins';
import { useThemeStore } from '@/store/themeStore';
import { usePrefsStore } from '@/store/prefsStore';

interface CustomizationItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: 'themes' | 'voices' | 'backgrounds' | 'features' | 'ai';
  icon: React.ComponentType<{ className?: string }>;
  preview?: string;
  gradient?: string;
  color?: string;
  isPremium?: boolean;
  comingSoon?: boolean;
  demoUrl?: string;
}

const customizations: CustomizationItem[] = [
  // Themes
  {
    id: 'base-theme',
    name: 'Base Theme',
    description: 'Clean default Mac OS light and dark mode',
    cost: 0,
    category: 'themes',
    icon: Settings,
    gradient: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
    color: '#6c757d'
  },
  {
    id: 'mac-classic',
    name: 'Mac Classic',
    description: 'Original Mac OS vibes with modern touches',
    cost: 0,
    category: 'themes',
    icon: Sun,
    gradient: 'linear-gradient(135deg, #007AFF, #32D74B)',
    color: '#007AFF'
  },
  {
    id: 'dark-elegance',
    name: 'Dark Elegance',
    description: 'Premium dark theme with subtle animations',
    cost: 25,
    category: 'themes',
    icon: Moon,
    gradient: 'linear-gradient(135deg, #1a1a1a, #2d2d30)',
    color: '#2d2d30'
  },
  {
    id: 'neon-cyber',
    name: 'Neon Cyber',
    description: 'Cyberpunk aesthetics with glowing elements',
    cost: 50,
    category: 'themes',
    icon: Zap,
    gradient: 'linear-gradient(135deg, #ff0080, #00ff80, #0080ff)',
    color: '#ff0080',
    isPremium: true
  },
  {
    id: 'bao-garden',
    name: '🌸 Bao Garden',
    description: 'Serene Asian garden theme with cherry blossoms',
    cost: 35,
    category: 'themes',
    icon: Sun,
    gradient: 'linear-gradient(135deg, #FFB6C1, #FFA0C9, #87CEEB)',
    color: '#FFB6C1'
  },
  {
    id: 'dim-sum-delight',
    name: '🥟 Dim Sum Delight',
    description: 'Warm, cozy theme inspired by bamboo steamers',
    cost: 40,
    category: 'themes',
    icon: Sun,
    gradient: 'linear-gradient(135deg, #DEB887, #F4A460, #CD853F)',
    color: '#DEB887'
  },

  // Voice Modes
  {
    id: 'voice-assistant',
    name: 'Voice Assistant',
    description: 'Navigate with natural voice commands',
    cost: 75,
    category: 'voices',
    icon: Mic,
    gradient: 'linear-gradient(135deg, #FF375F, #BF5AF2)',
    color: '#FF375F',
    isPremium: true
  },
  {
    id: 'ambient-sounds',
    name: 'Ambient Sounds',
    description: 'Productivity soundscapes and focus music',
    cost: 30,
    category: 'voices',
    icon: Headphones,
    gradient: 'linear-gradient(135deg, #32D74B, #007AFF)',
    color: '#32D74B'
  },
  {
    id: 'voice-feedback',
    name: 'Voice Feedback',
    description: 'Audio confirmation for all actions',
    cost: 20,
    category: 'voices',
    icon: Volume2,
    gradient: 'linear-gradient(135deg, #FFD60A, #FF9F0A)',
    color: '#FFD60A'
  },
  {
    id: 'zen-kitchen-sounds',
    name: '🎋 Zen Kitchen Sounds',
    description: 'Soothing sounds of tea brewing, rice steaming, and bamboo',
    cost: 35,
    category: 'voices',
    icon: Headphones,
    gradient: 'linear-gradient(135deg, #8FBC8F, #87CEEB)',
    color: '#8FBC8F'
  },

  // Backgrounds
  {
    id: 'dynamic-wallpapers',
    name: 'Dynamic Wallpapers',
    description: 'Time-aware backgrounds that change throughout the day',
    cost: 40,
    category: 'backgrounds',
    icon: Image,
    gradient: 'linear-gradient(135deg, #FF9F0A, #FFD60A)',
    color: '#FF9F0A'
  },
  {
    id: 'particle-effects',
    name: 'Particle Effects',
    description: 'Subtle animated particles in the background',
    cost: 35,
    category: 'backgrounds',
    icon: Sparkles,
    gradient: 'linear-gradient(135deg, #BF5AF2, #FF375F)',
    color: '#BF5AF2'
  },
  {
    id: 'food-particles',
    name: '🍃 Food Particles',
    description: 'Floating tea leaves, rice grains, and cherry blossoms',
    cost: 45,
    category: 'backgrounds',
    icon: Sparkles,
    gradient: 'linear-gradient(135deg, #90EE90, #98FB98, #87CEEB)',
    color: '#90EE90'
  },

  // Features
  {
    id: 'gesture-controls',
    name: 'Gesture Controls',
    description: 'Navigate with trackpad gestures and shortcuts',
    cost: 60,
    category: 'features',
    icon: Gamepad2,
    gradient: 'linear-gradient(135deg, #007AFF, #BF5AF2)',
    color: '#007AFF',
    isPremium: true
  },
  {
    id: 'focus-mode',
    name: 'Focus Mode',
    description: 'Pomodoro timer with notification blocking',
    cost: 35,
    category: 'features',
    icon: Brain,
    gradient: 'linear-gradient(135deg, #32D74B, #FFD60A)',
    color: '#32D74B'
  },
  {
    id: 'wellness-tracking',
    name: 'Wellness Tracking',
    description: 'Strain detection and break recommendations',
    cost: 45,
    category: 'features',
    icon: Heart,
    gradient: 'linear-gradient(135deg, #FF375F, #FF3B30)',
    color: '#FF375F'
  },
  {
    id: 'tea-timer',
    name: '🍵 Tea Timer',
    description: 'Perfect brewing timer for all tea types',
    cost: 25,
    category: 'features',
    icon: Clock,
    gradient: 'linear-gradient(135deg, #8FBC8F, #98FB98)',
    color: '#8FBC8F'
  },
  {
    id: 'recipe-snippets',
    name: '🥢 Recipe Snippets',
    description: 'Quick access to your favorite Asian recipes',
    cost: 30,
    category: 'features',
    icon: BookOpen,
    gradient: 'linear-gradient(135deg, #DEB887, #F4A460)',
    color: '#DEB887'
  },
  {
    id: 'light-temperature',
    name: 'Light Temperature',
    description: 'Automatic warm/cool lighting based on time of day',
    cost: 25,
    category: 'features',
    icon: Sun,
    gradient: 'linear-gradient(135deg, #FFD60A, #FF9F0A)',
    color: '#FFD60A'
  },

  // AI Features
  {
    id: 'smart-suggestions',
    name: 'Smart Suggestions',
    description: 'AI-powered task prioritization and recommendations',
    cost: 100,
    category: 'ai',
    icon: Wand2,
    gradient: 'linear-gradient(135deg, #BF5AF2, #007AFF)',
    color: '#BF5AF2',
    isPremium: true,
    comingSoon: true
  },
  {
    id: 'predictive-layout',
    name: 'Predictive Layout',
    description: 'Interface adapts to your workflow patterns',
    cost: 150,
    category: 'ai',
    icon: Layers,
    gradient: 'linear-gradient(135deg, #FF9F0A, #FF375F)',
    color: '#FF9F0A',
    isPremium: true,
    comingSoon: true
  }
];

const SHOP_THEME_TO_SKIN: Record<string, string> = {
  'base-theme': 'monochrome',
  'mac-classic': 'sunrise',
  'dark-elegance': 'midnight',
  'neon-cyber': 'high-contrast-pro',
  'bao-garden': 'bao-garden',
  'dim-sum-delight': 'dim-sum-delight'
};

const themeFeatureIds = customizations
  .filter(item => item.category === 'themes' && item.id !== 'base-theme')
  .map(item => item.id);

const skinLookup = new Map(SKINS.map((skin) => [skin.id, skin] as const));

interface CustomizationMarketplaceProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomizationMarketplace({ open, onOpenChange }: CustomizationMarketplaceProps) {
  const [activeTab, setActiveTab] = useState('themes');
  const {
    lychees,
    incLychees,
    purchasedItems,
    activeFeatures,
    addPurchasedItem,
    toggleFeature,
    selectTheme,
    hasPurchased,
    isFeatureActive
  } = usePrefsStore();

  const { applyTheme, setActiveTheme } = useThemeStore();

  const handlePurchase = (item: CustomizationItem) => {
    if (lychees >= item.cost && !item.comingSoon) {
      incLychees(-item.cost);
      addPurchasedItem(item.id);

      if (item.category === 'themes') {
        selectTheme(item.id);
        const skinId = SHOP_THEME_TO_SKIN[item.id] ?? 'monochrome';
        const skin = skinLookup.get(skinId);

        if (skin) {
          setActiveTheme(skin.id);
          applyTheme(skin);
        }
      } else {
        toggleFeature(item.id); // Activate immediately after purchase
      }
    }
  };

  const handleToggle = (itemId: string, category: CustomizationItem['category'], nextChecked = true) => {
    if (category === 'themes') {
      const targetThemeId = nextChecked ? itemId : 'base-theme';
      selectTheme(targetThemeId);

      const skinId = SHOP_THEME_TO_SKIN[targetThemeId] ?? 'monochrome';
      const skin = skinLookup.get(skinId);

      if (skin) {
        setActiveTheme(skin.id);
        applyTheme(skin);
      }
    } else {
      toggleFeature(itemId);
    }
  };

  const canPurchase = (item: CustomizationItem) => lychees >= item.cost && !item.comingSoon;
  const isOwned = (item: CustomizationItem) => hasPurchased(item.id);
  const isActive = (item: CustomizationItem) => {
    if (item.id === 'base-theme') {
      // Base theme is active when no other themes are active
      return !themeFeatureIds.some(theme => isFeatureActive(theme));
    }
    return isFeatureActive(item.id);
  };

  const categoryItems = (category: string) => 
    customizations.filter(item => item.category === category);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'themes': return Palette;
      case 'voices': return Mic;
      case 'backgrounds': return Image;
      case 'features': return Settings;
      case 'ai': return Brain;
      default: return Sparkles;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-mac-blue" />
              Customization Marketplace
            </DialogTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-mac-yellow" />
                <span className="font-semibold">{lychees} Lychees 🍇</span>
              </div>
              <Badge variant="outline" className="gap-1">
                <Crown className="w-3 h-3" />
                {purchasedItems.size - 1} Owned
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="themes" className="gap-2">
              <Palette className="w-4 h-4" />
              Themes
            </TabsTrigger>
            <TabsTrigger value="voices" className="gap-2">
              <Mic className="w-4 h-4" />
              Voice
            </TabsTrigger>
            <TabsTrigger value="backgrounds" className="gap-2">
              <Image className="w-4 h-4" />
              Backgrounds
            </TabsTrigger>
            <TabsTrigger value="features" className="gap-2">
              <Settings className="w-4 h-4" />
              Features
            </TabsTrigger>
            <TabsTrigger value="ai" className="gap-2">
              <Brain className="w-4 h-4" />
              AI Powers
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-4">
            {['themes', 'voices', 'backgrounds', 'features', 'ai'].map(category => (
              <TabsContent key={category} value={category} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryItems(category).map((item) => {
                    const IconComponent = item.icon;
                    const owned = isOwned(item);
                    const active = isActive(item);
                    const affordable = canPurchase(item);

                    return (
                      <Card 
                        key={item.id}
                        className={cn(
                          "relative overflow-hidden transition-all duration-200 hover:shadow-lg",
                          active && "ring-2 ring-mac-blue shadow-lg",
                          item.comingSoon && "opacity-75"
                        )}
                      >
                        {/* Preview Header */}
                        <div 
                          className="h-24 w-full relative"
                          style={{ background: item.gradient || item.color }}
                        >
                          <div className="absolute top-2 left-2">
                            <IconComponent className="w-6 h-6 text-white drop-shadow-lg" />
                          </div>
                          <div className="absolute top-2 right-2 flex gap-1">
                            {item.isPremium && (
                              <Crown className="w-5 h-5 text-yellow-300 drop-shadow-lg" />
                            )}
                            {item.comingSoon && (
                              <Badge className="bg-black/20 text-white border-white/20">
                                Soon
                              </Badge>
                            )}
                            {active && owned && (
                              <Badge className="bg-white/20 text-white border-white/30">
                                <Check className="w-3 h-3 mr-1" />
                                Active
                              </Badge>
                            )}
                          </div>

                          {/* Live Preview for themes */}
                          {category === 'themes' && (
                            <div className="absolute bottom-2 left-2 right-2">
                              <div className="h-2 bg-white/20 rounded-full">
                                <div 
                                  className="h-full bg-white/60 rounded-full transition-all duration-1000"
                                  style={{ width: `${20 + Math.sin(Date.now() / 1000) * 30}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div>
                              <h3 className="font-semibold text-lg">{item.name}</h3>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>

                            {/* Progress indicator for features */}
                            {category === 'features' && owned && (
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span>Integration</span>
                                  <span>85%</span>
                                </div>
                                <Progress value={85} className="h-1" />
                              </div>
                            )}

                            {/* Action Controls */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {item.cost === 0 ? (
                                  <Badge variant="secondary">Free</Badge>
                                ) : (
                                  <Badge variant="outline" className="gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    {item.cost}
                                  </Badge>
                                )}
                              </div>

                              {owned ? (
                                <div className="flex items-center gap-2">
                                  {category !== 'ai' && (
                                    <Switch
                                      checked={active}
                                      onCheckedChange={(checked) => handleToggle(item.id, category, checked)}
                                      disabled={item.comingSoon}
                                    />
                                  )}
                                  <span className="text-sm text-muted-foreground">
                                    {active ? 'On' : 'Off'}
                                  </span>
                                </div>
                              ) : (
                                <Button 
                                  size="sm"
                                  variant={affordable ? "default" : "outline"}
                                  disabled={!affordable}
                                  onClick={() => handlePurchase(item)}
                                  className={cn(
                                    affordable && !item.comingSoon && "bg-gradient-interactive hover:opacity-90"
                                  )}
                                >
                                  {item.comingSoon ? 'Coming Soon' :
                                   item.cost === 0 ? 'Get Free' :
                                   affordable ? 'Purchase' : 'Need More Lychees'}
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Category Info */}
                <Card className="bg-gradient-subtle border-dashed">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const Icon = getCategoryIcon(category);
                        return <Icon className="w-5 h-5 text-muted-foreground" />;
                      })()}
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">
                          {category === 'themes' && 'Visual Themes'}
                          {category === 'voices' && 'Audio & Voice'}
                          {category === 'backgrounds' && 'Background Effects'}
                          {category === 'features' && 'Productivity Features'}
                          {category === 'ai' && 'AI-Powered Enhancements'}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {category === 'themes' && 'Transform your interface with beautiful color schemes and visual styles'}
                          {category === 'voices' && 'Add audio feedback, voice control, and ambient soundscapes'}
                          {category === 'backgrounds' && 'Dynamic wallpapers and particle effects for immersion'}
                          {category === 'features' && 'Advanced productivity tools and workflow enhancements'}
                          {category === 'ai' && 'Next-generation AI features that learn and adapt to your habits'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </div>
        </Tabs>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="w-4 h-4" />
            <span>Earn lychees by completing tasks, closing tabs, and daily usage!</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Star className="w-3 h-3" />
              {Math.floor(purchasedItems.size * 8.7)}/100 Satisfaction
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}