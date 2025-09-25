import { useState, useEffect } from 'react';
import { Container } from '@/components/layout/Container';
import { SecondaryTabBar } from '@/components/layout/SecondaryTabBar';
import { ZoomSlider } from '@/components/demo/ZoomSlider';
import { VoiceMockup } from '@/components/demo/VoiceMockup';
import { useLayoutContext } from '@/components/layout/Layout';
import { SnippetCard } from '@/components/demo/SnippetCard';
import { TabsDigest } from '@/components/demo/TabsDigest';
import { FocusMode } from '@/components/demo/FocusMode';
import { WellnessTracker } from '@/components/demo/WellnessTracker';
import { PersonaWidget } from '@/components/demo/PersonaWidget';
import { ExpandableServiceWidget } from '@/components/demo/ExpandableServiceWidget';
import { TabDelayWidget } from '@/components/demo/TabDelayWidget';
import { AdaptiveIndicator } from '@/components/demo/AdaptiveIndicator';
import { PomodoroWidget } from '@/components/demo/PomodoroWidget';
import { CommandPalette } from '@/components/demo/CommandPalette';
import { AssistDemo } from '@/components/demo/AssistDemo';
import { KeyboardHelp } from '@/components/demo/KeyboardHelp';
import { ThemeMarketplace } from '@/components/demo/ThemeMarketplace';
import { CustomizationMarketplace } from '@/components/demo/CustomizationMarketplace';
import { LightTemperature } from '@/components/demo/LightTemperature';
import { usePrefsStore } from '@/store/prefsStore';
import { getTimeAwareWorkdayData, getTimeAwareWeekendData, SnippetData } from '@/data/seeds';
import { cn } from '@/lib/utils';

export default function Demo() {
  const { dayMode, profile, zoomLevel, isFeatureActive } = usePrefsStore();
  const { setCustomizationsHandler, setThemesHandler } = useLayoutContext();
  const [completedSnippets, setCompletedSnippets] = useState<Set<string>>(new Set());
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [showThemeMarketplace, setShowThemeMarketplace] = useState(false);
  const [showCustomizationMarketplace, setShowCustomizationMarketplace] = useState(false);
  
  const currentData = dayMode === 'workday' ? getTimeAwareWorkdayData() : getTimeAwareWeekendData();
  const isSenior = profile === 'senior';

  // Set up header handlers
  useEffect(() => {
    setCustomizationsHandler(() => setShowCustomizationMarketplace(true));
    setThemesHandler(() => setShowThemeMarketplace(true));
  }, [setCustomizationsHandler, setThemesHandler]);

  // Apply zoom level as CSS variables for responsive scaling
  useEffect(() => {
    document.documentElement.style.setProperty('--zoom-level', zoomLevel.toString());
    document.documentElement.style.setProperty('--zoom-text-xs', `${0.75 * zoomLevel}rem`);
    document.documentElement.style.setProperty('--zoom-text-sm', `${0.875 * zoomLevel}rem`);
    document.documentElement.style.setProperty('--zoom-text-base', `${1 * zoomLevel}rem`);
    document.documentElement.style.setProperty('--zoom-text-lg', `${1.125 * zoomLevel}rem`);
    document.documentElement.style.setProperty('--zoom-text-xl', `${1.25 * zoomLevel}rem`);
    document.documentElement.style.setProperty('--zoom-text-2xl', `${1.5 * zoomLevel}rem`);
    document.documentElement.style.setProperty('--zoom-padding', `${zoomLevel}rem`);
    document.documentElement.style.setProperty('--zoom-margin', `${zoomLevel * 0.5}rem`);
    document.documentElement.style.setProperty('--zoom-gap', `${zoomLevel * 0.75}rem`);
  }, [zoomLevel]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only show keyboard help for power users
      if (profile === 'power' && e.key === '?' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setShowKeyboardHelp(true);
      }
      
      // Theme marketplace shortcut
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        setShowThemeMarketplace(true);
      }

      // Customization marketplace shortcut
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'M') {
        e.preventDefault();
        setShowCustomizationMarketplace(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [profile]);
  const maxItemsPerSection = isSenior ? 6 : 8;

  const handleSnippetDone = (id: string) => {
    setCompletedSnippets(prev => new Set(prev).add(id));
  };

  const handleSnippetDismiss = (id: string) => {
    setCompletedSnippets(prev => new Set(prev).add(id));
  };

  const filterCompleted = (items: SnippetData[]) => 
    items.filter(item => !completedSnippets.has(item.id));

  return (
    <div className="min-h-screen bg-background">
      <LightTemperature />
      <SecondaryTabBar />
      <ZoomSlider />
      <VoiceMockup />
      <Container size="full" className="py-6">
        <div
          className="space-y-6 transition-all duration-300"
          style={{
            fontSize: profile === 'senior' ? `var(--zoom-text-base)` : undefined,
            gap: profile === 'senior' ? `var(--zoom-gap)` : undefined
          }}
        >
          {/* New Tab Simulation */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30 border text-sm text-muted-foreground">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              shapeshifter://home • New Tab
            </div>
          </div>

          {/* Performance Metrics & Tab Replacement Stats */}
          <div className="text-center">
            <div className="inline-flex items-center gap-6 px-6 py-3 rounded-xl bg-muted/30 border">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">47→7</div>
                <div className="text-xs text-muted-foreground">Tabs Replaced</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">-34%</div>
                <div className="text-xs text-muted-foreground">Time to Action</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{profile === 'senior' ? '85%' : profile === 'power' ? '92%' : '79%'}</div>
                <div className="text-xs text-muted-foreground">Focus Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">3</div>
                <div className="text-xs text-muted-foreground">Delayed Tabs</div>
              </div>
            </div>
          </div>

          {/* Bento Box Layout */}
          <div className={cn(
            "bento-grid gap-4",
            isSenior ? "bento-grid-senior" : "bento-grid-default"
          )}>

            {/* Hero Today Card */}
            <div className="bento-hero">
              <div className="card-gradient p-6 rounded-2xl h-full flex flex-col">
                <div className="mb-4">
                  <h2 className={cn(
                    "font-bold text-foreground",
                    isSenior ? "text-3xl" : "text-2xl"
                  )}>
                    Priority Focus
                  </h2>
                  <p className={cn(
                    "text-muted-foreground mt-1",
                    isSenior ? "text-lg" : "text-base"
                  )}>
                    {filterCompleted(currentData.today).length} tasks need your attention
                  </p>
                </div>

                <div className="flex-1 space-y-3">
                  {filterCompleted(currentData.today).slice(0, isSenior ? 3 : 4).map((snippet, index) => (
                    <SnippetCard
                      key={snippet.id}
                      snippet={snippet}
                      onDone={handleSnippetDone}
                      onDismiss={handleSnippetDismiss}
                      variant={index === 0 ? "featured" : "compact"}
                      showCredits={true}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Expandable Gmail Widget */}
            <div className="bento-digest">
              <ExpandableServiceWidget
                serviceType="gmail"
                title="Gmail"
                count={3}
              />
            </div>

            {/* Patterns Grid */}
            <div className="bento-patterns">
              <div className="card-gradient p-4 rounded-2xl h-full">
                <div className="mb-3">
                  <h3 className={cn(
                    "font-semibold text-foreground",
                    isSenior ? "text-xl" : "text-lg"
                  )}>
                    Your Patterns
                  </h3>
                  <p className={cn(
                    "text-muted-foreground text-sm",
                    isSenior && "text-base"
                  )}>
                    Regular returns
                  </p>
                </div>

                <div className="space-y-2">
                  {filterCompleted(currentData.patterns).slice(0, isSenior ? 4 : 6).map((snippet) => (
                    <SnippetCard
                      key={snippet.id}
                      snippet={snippet}
                      onDone={handleSnippetDone}
                      onDismiss={handleSnippetDismiss}
                      variant="mini"
                      showCredits={true}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bento-actions">
              <div className="hero-gradient p-4 rounded-2xl text-white h-full flex flex-col justify-center items-center">
                <div className="text-center">
                  <div className={cn(
                    "font-bold mb-2",
                    isSenior ? "text-2xl" : "text-xl"
                  )}>
                    +{completedSnippets.size * 5}
                  </div>
                  <div className={cn(
                    "text-white/80",
                    isSenior ? "text-base" : "text-sm"
                  )}>
                    Credits Earned
                  </div>
                </div>
              </div>
            </div>

            {/* Snippets Feed */}
            <div className="bento-snippets">
              <div className="card-gradient p-4 rounded-2xl h-full">
                <div className="mb-3">
                  <h3 className={cn(
                    "font-semibold text-foreground",
                    isSenior ? "text-xl" : "text-lg"
                  )}>
                    Quick Snippets
                  </h3>
                  <p className={cn(
                    "text-muted-foreground text-sm",
                    isSenior && "text-base"
                  )}>
                    Act without tabs
                  </p>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filterCompleted(currentData.snippets).slice(0, isSenior ? 8 : 12).map((snippet) => (
                    <SnippetCard
                      key={snippet.id}
                      snippet={snippet}
                      onDone={handleSnippetDone}
                      onDismiss={handleSnippetDismiss}
                      variant="compact"
                      showCredits={true}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* YouTube Widget */}
            <div className="bento-weather">
              <ExpandableServiceWidget
                serviceType="youtube"
                title="YouTube"
                count={2}
              />
            </div>

            {/* Default Widget */}
            <div className="bento-wellness">
              <PersonaWidget />
            </div>

            {/* Slack Widget */}
            <div className="bento-extra">
              <ExpandableServiceWidget
                serviceType="slack"
                title="Slack"
                count={4}
              />
            </div>

            {/* Tab Delay Widget */}
            <div className="bento-delay">
              <TabDelayWidget />
            </div>

            {/* AI Adaptation Indicator */}
            <div className="bento-ai">
              <AdaptiveIndicator />
            </div>

            {/* Purchased Widgets - Show only if active */}
            {isFeatureActive('focus-mode') && (
              <div className="bento-pomodoro">
                <PomodoroWidget />
              </div>
            )}

            {isFeatureActive('wellness-tracking') && (
              <div className="bento-wellness-purchased">
                <WellnessTracker />
              </div>
            )}

          </div>

          {/* Mode Switch Indicator */}
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border">
              <div className="w-2 h-2 rounded-full bg-green-500 transition-all duration-500"></div>
              <span className="text-sm font-medium">
                {dayMode === 'workday' ? 'Workday mode active' : 'Weekend mode active'}
              </span>
            </div>
          </div>
        </div>
      </Container>

      <CommandPalette />
      
      {/* New Features */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AssistDemo />
      </div>
      
      {/* Keyboard Help Modal */}
      <KeyboardHelp 
        open={showKeyboardHelp} 
        onOpenChange={setShowKeyboardHelp}
      />
      
      {/* Theme Marketplace Modal */}
      <ThemeMarketplace
        open={showThemeMarketplace}
        onOpenChange={setShowThemeMarketplace}
      />
      
      {/* Customization Marketplace Modal */}
      <CustomizationMarketplace
        open={showCustomizationMarketplace}
        onOpenChange={setShowCustomizationMarketplace}
      />
    </div>
  );
}