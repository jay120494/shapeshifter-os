import { useState, useEffect, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { Container } from '@/components/layout/Container';
import { SecondaryTabBar } from '@/components/layout/SecondaryTabBar';
import { ZoomSlider } from '@/components/demo/ZoomSlider';
import { VoiceMockup } from '@/components/demo/VoiceMockup';
import { useLayoutContext } from '@/components/layout/Layout';
import { SnippetCard } from '@/components/demo/SnippetCard';
import { ExpandableServiceWidget } from '@/components/demo/ExpandableServiceWidget';
import { TabDelayWidget } from '@/components/demo/TabDelayWidget';
import { AdaptiveIndicator } from '@/components/demo/AdaptiveIndicator';
import { PomodoroWidget } from '@/components/demo/PomodoroWidget';
import { WellnessTracker } from '@/components/demo/WellnessTracker';
import { PersonaWidget } from '@/components/demo/PersonaWidget';
import { CommandPalette } from '@/components/demo/CommandPalette';
import { AssistDemo } from '@/components/demo/AssistDemo';
import { KeyboardHelp } from '@/components/demo/KeyboardHelp';
import { SkinGallery } from '@/components/demo/ThemeMarketplace';
import { CustomizationMarketplace } from '@/components/demo/CustomizationMarketplace';
import { LightTemperature } from '@/components/demo/LightTemperature';
import { TeaBreakWidget } from '@/components/demo/TeaBreakWidget';
import { RecipeWidget } from '@/components/demo/RecipeWidget';
import { usePrefsStore } from '@/store/prefsStore';
import { useLayoutStore, getLayoutForProfile, WidgetId } from '@/store/layoutStore';
import type { Profile } from '@/store/prefsStore';
import { getTimeAwareWorkdayData, getTimeAwareWeekendData, SnippetData } from '@/data/seeds';
import { cn } from '@/lib/utils';
import { GripVertical } from 'lucide-react';

const getSeniorColumnCount = (zoomLevel: number) => {
  if (zoomLevel >= 2.5) return 1;
  if (zoomLevel >= 1.5) return 2;
  return 3;
};

type WidgetSpan = {
  colSpan: number;
  rowSpan: number;
};

interface WidgetDefinition {
  id: WidgetId;
  className: string;
  enabled: boolean;
  content: ReactNode;
}

const WIDGET_SPANS: Record<WidgetId, { default: WidgetSpan; senior?: WidgetSpan }> = {
  hero: {
    default: { colSpan: 6, rowSpan: 1 },
    senior: { colSpan: 2, rowSpan: 1 }
  },
  digest: {
    default: { colSpan: 3, rowSpan: 1 },
    senior: { colSpan: 1, rowSpan: 1 }
  },
  patterns: {
    default: { colSpan: 3, rowSpan: 1 },
    senior: { colSpan: 1, rowSpan: 1 }
  },
  actions: {
    default: { colSpan: 3, rowSpan: 1 },
    senior: { colSpan: 1, rowSpan: 1 }
  },
  snippets: {
    default: { colSpan: 6, rowSpan: 1 },
    senior: { colSpan: 2, rowSpan: 1 }
  },
  weather: {
    default: { colSpan: 3, rowSpan: 1 },
    senior: { colSpan: 1, rowSpan: 1 }
  },
  persona: {
    default: { colSpan: 3, rowSpan: 1 },
    senior: { colSpan: 1, rowSpan: 1 }
  },
  extra: {
    default: { colSpan: 3, rowSpan: 1 },
    senior: { colSpan: 1, rowSpan: 1 }
  },
  delay: {
    default: { colSpan: 4, rowSpan: 1 },
    senior: { colSpan: 1, rowSpan: 1 }
  },
  ai: {
    default: { colSpan: 4, rowSpan: 1 },
    senior: { colSpan: 1, rowSpan: 1 }
  },
  pomodoro: {
    default: { colSpan: 3, rowSpan: 1 },
    senior: { colSpan: 1, rowSpan: 1 }
  },
  wellness: {
    default: { colSpan: 3, rowSpan: 1 },
    senior: { colSpan: 1, rowSpan: 1 }
  },
  'tea-break': {
    default: { colSpan: 4, rowSpan: 1 },
    senior: { colSpan: 2, rowSpan: 1 }
  },
  recipes: {
    default: { colSpan: 4, rowSpan: 1 },
    senior: { colSpan: 2, rowSpan: 1 }
  }
};

const getSpanForProfile = (id: WidgetId, profile: Profile, zoomLevel: number): WidgetSpan => {
  const config = WIDGET_SPANS[id];
  const base = profile === 'senior' && config.senior ? config.senior : config.default;

  if (profile === 'senior') {
    const columns = getSeniorColumnCount(zoomLevel);
    return {
      colSpan: Math.max(1, Math.min(base.colSpan, columns)),
      rowSpan: Math.max(1, base.rowSpan)
    };
  }

  return {
    colSpan: Math.max(1, Math.min(base.colSpan, 12)),
    rowSpan: Math.max(1, base.rowSpan)
  };
};

export default function Demo() {
  const { dayMode, profile, zoomLevel, isFeatureActive } = usePrefsStore();
  const { setCustomizationsHandler, setSkinsHandler } = useLayoutContext();
  const [completedSnippets, setCompletedSnippets] = useState<Set<string>>(new Set());
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [showSkinGallery, setShowSkinGallery] = useState(false);
  const [showCustomizationMarketplace, setShowCustomizationMarketplace] = useState(false);

  const currentData = dayMode === 'workday' ? getTimeAwareWorkdayData() : getTimeAwareWeekendData();
  const isSenior = profile === 'senior';

  useEffect(() => {
    setCustomizationsHandler(() => setShowCustomizationMarketplace(true));
    setSkinsHandler(() => setShowSkinGallery(true));
  }, [setCustomizationsHandler, setSkinsHandler]);

  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty('--zoom-level', zoomLevel.toString());
    root.style.setProperty('--zoom-text-xs', `${0.75 * zoomLevel}rem`);
    root.style.setProperty('--zoom-text-sm', `${0.875 * zoomLevel}rem`);
    root.style.setProperty('--zoom-text-base', `${1 * zoomLevel}rem`);
    root.style.setProperty('--zoom-text-lg', `${1.125 * zoomLevel}rem`);
    root.style.setProperty('--zoom-text-xl', `${1.25 * zoomLevel}rem`);
    root.style.setProperty('--zoom-text-2xl', `${1.5 * zoomLevel}rem`);
    root.style.setProperty('--zoom-padding', `${zoomLevel}rem`);
    root.style.setProperty('--zoom-margin', `${zoomLevel * 0.5}rem`);
    root.style.setProperty('--zoom-gap', `${zoomLevel * 0.75}rem`);

    if (profile === 'senior') {
      const cardMinWidth = Math.min(520, 300 + (zoomLevel - 1) * 140);
      const autoRowHeight = Math.min(440, 220 + (zoomLevel - 1) * 110);
      const columns = getSeniorColumnCount(zoomLevel);

      root.style.setProperty('--zoom-card-min-width', `${cardMinWidth}px`);
      root.style.setProperty('--zoom-auto-rows', `${autoRowHeight}px`);
      root.style.setProperty('--zoom-grid-columns', columns.toString());
      root.style.setProperty('--senior-zoom', zoomLevel.toString());
    } else {
      root.style.removeProperty('--zoom-card-min-width');
      root.style.removeProperty('--zoom-auto-rows');
      root.style.removeProperty('--zoom-grid-columns');
      root.style.removeProperty('--senior-zoom');
    }
  }, [profile, zoomLevel]);

  useEffect(() => {
    const body = document.body;

    if (dayMode === 'workday') {
      body.setAttribute('data-day-mode', 'workday');
    } else {
      body.setAttribute('data-day-mode', 'weekend');
    }

    return () => {
      body.removeAttribute('data-day-mode');
    };
  }, [dayMode]);

  const layouts = useLayoutStore(state => state.layouts);
  const setLayout = useLayoutStore(state => state.setLayout);

  const focusModeActive = isFeatureActive('focus-mode');
  const wellnessActive = isFeatureActive('wellness-tracking');
  const teaTimerActive = isFeatureActive('tea-timer');
  const recipeFeatureActive = isFeatureActive('recipe-snippets');
  const zenKitchenActive = isFeatureActive('zen-kitchen-sounds');
  const ambientSoundActive = isFeatureActive('ambient-sounds');
  const dynamicWallpapersActive = isFeatureActive('dynamic-wallpapers');
  const particleEffectsActive = isFeatureActive('particle-effects');
  const foodParticlesActive = isFeatureActive('food-particles');

  const handleSnippetDone = useCallback((id: string) => {
    setCompletedSnippets(prev => new Set(prev).add(id));
  }, []);

  const handleSnippetDismiss = useCallback((id: string) => {
    setCompletedSnippets(prev => new Set(prev).add(id));
  }, []);

  const filterCompleted = useCallback((items: SnippetData[]) =>
    items.filter(item => !completedSnippets.has(item.id)),
  [completedSnippets]);

  const widgetDefinitions = useMemo<WidgetDefinition[]>(() => {
    const heroContent = (
      <div className="card-gradient p-6 rounded-2xl flex flex-col">
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
    );

    const patternsContent = (
      <div className="card-gradient p-4 rounded-2xl">
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
    );

    const snippetsContent = (
      <div className="card-gradient p-4 rounded-2xl">
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

        <div className="space-y-2 max-h-[28rem] overflow-y-auto">
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
    );

    return [
      { id: 'hero', className: 'bento-hero', enabled: true, content: heroContent },
      { id: 'digest', className: 'bento-digest', enabled: true, content: (
        <ExpandableServiceWidget serviceType="gmail" title="Gmail" count={3} />
      ) },
      { id: 'patterns', className: 'bento-patterns', enabled: true, content: patternsContent },
      { id: 'actions', className: 'bento-actions', enabled: true, content: (
        <div className="hero-gradient p-4 rounded-2xl text-white flex flex-col justify-center items-center">
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
              Lychees Earned ðŸ‡
            </div>
          </div>
        </div>
      ) },
      { id: 'snippets', className: 'bento-snippets', enabled: true, content: snippetsContent },
      { id: 'weather', className: 'bento-weather', enabled: true, content: (
        <ExpandableServiceWidget serviceType="youtube" title="TeaTube" count={2} />
      ) },
      { id: 'persona', className: 'bento-wellness', enabled: true, content: <PersonaWidget /> },
      { id: 'extra', className: 'bento-extra', enabled: true, content: (
        <ExpandableServiceWidget serviceType="slack" title="Slack" count={4} />
      ) },
      { id: 'delay', className: 'bento-delay', enabled: true, content: <TabDelayWidget /> },
      { id: 'ai', className: 'bento-ai', enabled: true, content: <AdaptiveIndicator /> },
      { id: 'pomodoro', className: 'bento-pomodoro', enabled: focusModeActive, content: <PomodoroWidget /> },
      { id: 'wellness', className: 'bento-wellness-purchased', enabled: wellnessActive, content: <WellnessTracker /> },
      { id: 'tea-break', className: 'bento-tea', enabled: teaTimerActive, content: <TeaBreakWidget /> },
      { id: 'recipes', className: 'bento-recipes', enabled: recipeFeatureActive, content: <RecipeWidget /> }
    ];
  }, [
    completedSnippets.size,
    currentData.patterns,
    currentData.snippets,
    currentData.today,
    filterCompleted,
    focusModeActive,
    handleSnippetDismiss,
    handleSnippetDone,
    isSenior,
    recipeFeatureActive,
    teaTimerActive,
    wellnessActive
  ]);

  const widgetLookup = useMemo(() => {
    const map = new Map<WidgetId, WidgetDefinition>();
    widgetDefinitions.forEach(definition => {
      map.set(definition.id, definition);
    });
    return map;
  }, [widgetDefinitions]);

  const activeWidgetIds = useMemo(() =>
    widgetDefinitions.filter(def => def.enabled).map(def => def.id),
  [widgetDefinitions]);

  const completeOrder = useMemo(() => getLayoutForProfile(profile as Profile, layouts), [layouts, profile]);

  const layoutOrder = useMemo(() => {
    const filtered = completeOrder.filter(id => activeWidgetIds.includes(id));
    const missing = activeWidgetIds.filter(id => !filtered.includes(id));
    return [...filtered, ...missing];
  }, [activeWidgetIds, completeOrder]);

  const inactiveOrder = useMemo(() =>
    completeOrder.filter(id => !activeWidgetIds.includes(id)),
  [activeWidgetIds, completeOrder]);

  const orderedWidgets = useMemo(() =>
    layoutOrder
      .map(id => widgetLookup.get(id))
      .filter((widget): widget is WidgetDefinition => Boolean(widget)),
  [layoutOrder, widgetLookup]);

  const [draggingId, setDraggingId] = useState<WidgetId | null>(null);
  const [dropTargetId, setDropTargetId] = useState<WidgetId | null>(null);

  const handleReorder = useCallback((fromId: WidgetId, toId: WidgetId | null) => {
    if (!layoutOrder.includes(fromId)) {
      return;
    }

    const working = [...layoutOrder];
    const fromIndex = working.indexOf(fromId);
    if (fromIndex === -1) {
      return;
    }
    working.splice(fromIndex, 1);

    if (toId && working.includes(toId)) {
      const targetIndex = working.indexOf(toId);
      working.splice(targetIndex, 0, fromId);
    } else {
      working.push(fromId);
    }

    const uniqueActive = Array.from(new Set(working));
    const newComplete = [
      ...uniqueActive,
      ...inactiveOrder.filter(id => !uniqueActive.includes(id))
    ];

    setLayout(profile as Profile, newComplete);
  }, [inactiveOrder, layoutOrder, profile, setLayout]);

  useEffect(() => {
    const body = document.body;

    if (foodParticlesActive) {
      body.setAttribute('data-background', 'food');
    } else if (particleEffectsActive) {
      body.setAttribute('data-background', 'particles');
    } else if (dynamicWallpapersActive) {
      body.setAttribute('data-background', 'dynamic');
    } else {
      body.removeAttribute('data-background');
    }

    return () => {
      body.removeAttribute('data-background');
    };
  }, [dynamicWallpapersActive, foodParticlesActive, particleEffectsActive]);

  useEffect(() => {
    const body = document.body;
    if (zenKitchenActive) {
      body.setAttribute('data-soundscape', 'zen');
    } else if (ambientSoundActive) {
      body.setAttribute('data-soundscape', 'ambient');
    } else {
      body.removeAttribute('data-soundscape');
    }

    return () => {
      body.removeAttribute('data-soundscape');
    };
  }, [ambientSoundActive, zenKitchenActive]);

  return (
    <div className="min-h-screen bg-background demo-surface">
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
              shapeshifter://home â€” New Tab
            </div>
          </div>

          {/* Performance Metrics & Tab Replacement Stats */}
          <div className="text-center">
            <div className="inline-flex items-center gap-6 px-6 py-3 rounded-xl bg-muted/30 border">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">47â†’7</div>
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
                <div className="text-2xl font-bold text-amber-600">3</div>
                <div className="text-xs text-muted-foreground">Delayed Tabs</div>
              </div>
            </div>
          </div>

          {(zenKitchenActive || ambientSoundActive) && (
            <div className="flex justify-end mb-4">
              <div className="flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs text-muted-foreground shadow-sm">
                <span className="font-semibold text-amber-600">Steam mode</span>
                {zenKitchenActive ? 'Zen kitchen ambience activated' : 'Ambient workstation soundscape enabled'}
              </div>
            </div>
          )}

          {/* Bento Box Layout */}
          <div
            className={cn(
              'bento-grid gap-4',
              isSenior ? 'bento-grid-senior' : 'bento-grid-default'
            )}
            onDragOver={
              draggingId
                ? (event => {
                    event.preventDefault();
                    event.dataTransfer.dropEffect = 'move';
                  })
                : undefined
            }
            onDrop={
              draggingId
                ? (event => {
                    event.preventDefault();
                    handleReorder(draggingId, null);
                    setDraggingId(null);
                    setDropTargetId(null);
                  })
                : undefined
            }
          >
            {orderedWidgets.map((widget) => {
              const span = getSpanForProfile(widget.id, profile as Profile, zoomLevel);
              const isDraggingWidget = draggingId === widget.id;
              const isDropTargetWidget = dropTargetId === widget.id && draggingId !== widget.id;

              return (
                <article
                  key={widget.id}
                  className={cn(
                    'widget-draggable',
                    widget.className,
                    isDraggingWidget && 'dragging',
                    isDropTargetWidget && 'drop-target'
                  )}
                  style={{
                    gridColumn: `span ${span.colSpan}`,
                    gridRow: `span ${span.rowSpan}`
                  }}
                  onDragOver={
                    draggingId
                      ? (event => {
                          event.preventDefault();
                          event.stopPropagation();
                          event.dataTransfer.dropEffect = 'move';
                        })
                      : undefined
                  }
                  onDragEnter={
                    draggingId
                      ? (event => {
                          event.preventDefault();
                          event.stopPropagation();
                          if (widget.id !== draggingId) {
                            setDropTargetId(widget.id);
                          }
                        })
                      : undefined
                  }
                  onDragLeave={
                    draggingId
                      ? (() => {
                          if (dropTargetId === widget.id) {
                            setDropTargetId(null);
                          }
                        })
                      : undefined
                  }
                  onDrop={
                    draggingId
                      ? (event => {
                          event.preventDefault();
                          event.stopPropagation();
                          handleReorder(draggingId, widget.id);
                          setDraggingId(null);
                          setDropTargetId(null);
                        })
                      : undefined
                  }
                >
                  <button
                    type="button"
                    className="widget-handle"
                    aria-label="Drag to reposition widget"
                    draggable
                    onDragStart={(event) => {
                      setDraggingId(widget.id);
                      setDropTargetId(null);
                      event.dataTransfer.effectAllowed = 'move';
                      event.dataTransfer.setData('text/plain', widget.id);
                    }}
                    onDragEnd={() => {
                      setDraggingId(null);
                      setDropTargetId(null);
                    }}
                    onClick={(event) => event.preventDefault()}
                    onMouseDown={(event) => event.stopPropagation()}
                  >
                    <GripVertical className="w-3 h-3 text-muted-foreground" />
                  </button>
                  {widget.content}
                </article>
              );
            })}
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        <AssistDemo />
      </div>

      <KeyboardHelp
        open={showKeyboardHelp}
        onOpenChange={setShowKeyboardHelp}
      />

      <SkinGallery
        open={showSkinGallery}
        onOpenChange={setShowSkinGallery}
      />

      <CustomizationMarketplace
        open={showCustomizationMarketplace}
        onOpenChange={setShowCustomizationMarketplace}
      />
    </div>
  );
}
