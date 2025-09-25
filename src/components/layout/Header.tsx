import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Sun,
  Moon,
  Sparkles,
  Palette,
  ShoppingBag,
  Brain,
  FileText
} from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import { usePrefsStore } from '@/store/prefsStore';
import { Container } from './Container';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onOpenCustomizations?: () => void;
  onOpenThemes?: () => void;
}

export function Header({ onOpenCustomizations, onOpenThemes }: HeaderProps = {}) {
  const location = useLocation();
  const isDemo = location.pathname === '/demo';
  const { theme, setTheme } = useTheme();
  const { 
    credits, 
    profile, 
    dayMode, 
    calmScore, 
    openTabs,
    setProfile,
    setDayMode
  } = usePrefsStore();

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <Container>
          <div className="flex h-16 items-center justify-between">
            {/* Left: Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-hero flex items-center justify-center">
                <Sparkles className="text-white w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-none">Shapeshifter OS</span>
                <span className="text-xs text-muted-foreground leading-none">Living Interface</span>
              </div>
            </Link>

            {/* Center: Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary px-3 py-2",
                  location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                Home
              </Link>
              <Link
                to="/demo"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary px-3 py-2",
                  isDemo ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                Demo
              </Link>
            </nav>

            {/* Right: Controls and Metrics */}
            <div className="flex items-center space-x-6">
              {/* Theme Toggle (always first) */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="gap-2"
                  >
                    {theme === 'dark' ? (
                      <Sun className="w-4 h-4" />
                    ) : (
                      <Moon className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">
                      {theme === 'dark' ? 'Light' : 'Dark'}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Switch between light and dark themes</p>
                </TooltipContent>
              </Tooltip>

              {isDemo && (
                <>
                  {/* Themes and Shop (grouped) */}
                  <div className="flex items-center space-x-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={onOpenThemes}
                          className="gap-2"
                        >
                          <Palette className="w-4 h-4" />
                          <span className="hidden sm:inline">Themes</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Browse and apply visual themes</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={onOpenCustomizations}
                          className="gap-2"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span className="hidden sm:inline">Shop</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Purchase customization features and upgrades</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {/* Credits, Calm, and Docs (grouped metrics) */}
                  <div className="flex items-center space-x-4">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-achievement text-white text-sm font-medium cursor-pointer">
                          <Sparkles className="w-3 h-3" />
                          <span>{credits}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Credits earned by interacting with the interface - use them to buy customization features</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 text-sm cursor-pointer">
                          <Brain className="w-4 h-4 text-blue-500" />
                          <span>{calmScore}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Your calm score - measures how overwhelming the current layout and activities feel</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 text-sm cursor-pointer">
                          <FileText className="w-4 h-4 text-red-500" />
                          <span>{openTabs}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Outstanding docs that need your attention</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </>
              )}

              {!isDemo && (
                <Button asChild variant="default" size="sm" className="hero-gradient">
                  <Link to="/demo">Launch Demo</Link>
                </Button>
              )}
            </div>
          </div>
        </Container>
      </header>

    </>
  );
}