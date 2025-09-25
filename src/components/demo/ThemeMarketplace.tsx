import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette, Crown, Zap, Moon, Sun, Sparkles, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePrefsStore } from '@/store/prefsStore';
import { useThemeStore, CustomTheme } from '@/store/themeStore';

const themes: CustomTheme[] = [
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
  }
];

interface ThemeMarketplaceProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ThemeMarketplace({ open, onOpenChange }: ThemeMarketplaceProps) {
  const { credits, incCredits } = usePrefsStore();
  const { 
    activeTheme, 
    purchasedThemes, 
    setActiveTheme, 
    purchaseTheme, 
    isPurchased, 
    applyTheme 
  } = useThemeStore();

  const handlePurchase = (theme: CustomTheme) => {
    if (credits >= theme.cost) {
      incCredits(-theme.cost);
      purchaseTheme(theme);
      applyTheme(theme);
    }
  };

  const handleSelect = (theme: CustomTheme) => {
    setActiveTheme(theme.id);
    applyTheme(theme);
  };

  const canPurchase = (theme: CustomTheme) => credits >= theme.cost;
  const isOwned = (theme: CustomTheme) => isPurchased(theme.id);
  const isActive = (theme: CustomTheme) => activeTheme === theme.id;

  // Apply active theme on mount
  useEffect(() => {
    const currentTheme = themes.find(t => t.id === activeTheme);
    if (currentTheme) {
      applyTheme(currentTheme);
    }
  }, [activeTheme, applyTheme]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Theme Marketplace
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="font-semibold">{credits} Credits</span>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {themes.map((theme) => {
            const owned = isOwned(theme);
            const active = isActive(theme);
            const affordable = canPurchase(theme);
            const IconComponent = theme.id === 'sunrise' ? Sun : 
                                 theme.id === 'midnight' ? Moon : 
                                 theme.id === 'high-contrast-pro' ? Crown : Moon;

            return (
              <Card 
                key={theme.id}
                className={cn(
                  "relative overflow-hidden cursor-pointer transition-all duration-200",
                  active && "ring-2 ring-primary shadow-lg",
                  "hover:shadow-md"
                )}
                onClick={() => owned && handleSelect(theme)}
              >
                {/* Theme Preview */}
                <div 
                  className="h-24 w-full"
                  style={{ background: theme.gradient }}
                >
                  <div className="absolute top-2 left-2">
                    <IconComponent className="w-6 h-6 text-white drop-shadow-lg" />
                  </div>
                  <div className="absolute top-2 right-2">
                    {active && owned && (
                      <Badge className="bg-white text-black">
                        <Check className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    )}
                    {theme.category === 'pro' && (
                      <Crown className="w-5 h-5 text-yellow-300 drop-shadow-lg" />
                    )}
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">{theme.name}</h3>
                      <p className="text-sm text-muted-foreground">{theme.description}</p>
                    </div>

                    {/* Color Palette Preview */}
                    <div className="flex gap-1">
                      {Object.values(theme.colors).map((color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full border border-border"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {theme.cost === 0 ? (
                          <Badge variant="secondary">Free</Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1">
                            <Sparkles className="w-3 h-3" />
                            {theme.cost}
                          </Badge>
                        )}
                        <Badge 
                          variant={theme.category === 'pro' ? 'default' : 'secondary'}
                          className={cn(
                            theme.category === 'premium' && "bg-amber-100 text-amber-800",
                            theme.category === 'pro' && "bg-gradient-achievement"
                          )}
                        >
                          {theme.category.charAt(0).toUpperCase() + theme.category.slice(1)}
                        </Badge>
                      </div>

                      {owned ? (
                        <Button 
                          size="sm" 
                          variant={active ? "default" : "outline"}
                          onClick={() => handleSelect(theme)}
                        >
                          {active ? 'Active' : 'Select'}
                        </Button>
                      ) : (
                        <Button 
                          size="sm"
                          variant="outline"
                          disabled={!affordable || theme.cost === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePurchase(theme);
                          }}
                        >
                          {theme.cost === 0 ? 'Select' : 
                           affordable ? 'Purchase' : 'Need More Credits'}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="w-4 h-4" />
            <span>Earn more credits by completing tasks and closing tabs!</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}