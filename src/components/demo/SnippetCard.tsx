import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ExternalLink, Pin, Clock, Check, X, Zap, Star, Archive, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePrefsStore } from '@/store/prefsStore';
import { SnippetData } from '@/data/seeds';
import { ConfettiEffect } from './ConfettiEffect';

// Custom keyboard hint component
function KbdHint({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center px-1.5 py-0.5 text-xs font-mono bg-muted rounded border kbd-hint",
      className
    )}>
      {children}
    </span>
  );
}

interface SnippetCardProps {
  snippet: SnippetData;
  onDone?: (id: string) => void;
  onDismiss?: (id: string) => void;
  variant?: 'default' | 'compact' | 'mini' | 'featured';
  showCredits?: boolean;
}

export function SnippetCard({
  snippet,
  onDone,
  onDismiss,
  variant = 'default',
  showCredits = false
}: SnippetCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);
  const [showCreditsAnimation, setShowCreditsAnimation] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showHoverPreview, setShowHoverPreview] = useState(false);
  const { profile, zoomLevel, incrementCalm, incLychees, decrementTabs } = usePrefsStore();
  
  const handleDone = async () => {
    setIsCompleting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Enhanced rewards based on variant
    incrementCalm();
    const lycheeAmount = variant === 'featured' ? 3 : variant === 'compact' ? 1 : 2;
    incLychees(lycheeAmount);
    decrementTabs(1);
    
    // Show rewards animations
    if (showCredits) {
      setShowCreditsAnimation(true);
      setTimeout(() => setShowCreditsAnimation(false), 600);
    }
    
    // Show confetti for featured cards or high-value actions
    if (variant === 'featured' || lycheeAmount >= 3) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1000);
    }
    
    onDone?.(snippet.id);
    setIsCompleting(false);
  };

  const handleDismiss = async () => {
    setIsDismissing(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    onDismiss?.(snippet.id);
  };

  const isCompact = variant === 'compact' || variant === 'mini';
  const isSenior = profile === 'senior';

  const getPreviewContent = () => {
    if (!snippet.preview) return null;

    return (
      <div className="bg-background/95 backdrop-blur-sm border rounded-lg p-4 shadow-xl max-w-sm">
        <div className="space-y-3">
          {snippet.preview.details && (
            <div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Details</div>
              <div className="text-sm">{snippet.preview.details}</div>
            </div>
          )}

          {snippet.preview.context && (
            <div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Context</div>
              <div className="text-sm text-muted-foreground">{snippet.preview.context}</div>
            </div>
          )}

          {snippet.preview.metadata && Object.keys(snippet.preview.metadata).length > 0 && (
            <div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Info</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(snippet.preview.metadata).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-muted-foreground">{key}:</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {snippet.preview.actions && snippet.preview.actions.length > 0 && (
            <div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Quick Actions</div>
              <div className="flex flex-wrap gap-1">
                {snippet.preview.actions.map((action, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {action}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const getCardPadding = () => {
    switch (variant) {
      case 'featured':
        return isSenior ? "p-6" : "p-5";
      case 'mini':
        return "p-2";
      case 'compact':
        return "p-3";
      default:
        return isSenior ? "p-6" : "p-4";
    }
  };

  return (
    <div className="relative">
      {/* Confetti Effect */}
      <ConfettiEffect 
        active={showConfetti} 
        intensity={variant === 'featured' ? 'high' : 'medium'}
        onComplete={() => setShowConfetti(false)}
      />
      
      {/* Credits Animation */}
      {showCreditsAnimation && (
        <div className="absolute -top-8 right-4 z-10 credits-popup">
          <div className="bg-gradient-success text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            +{variant === 'featured' ? 3 : variant === 'compact' ? 1 : 2}
          </div>
        </div>
      )}

      {/* Hover Preview */}
      {showHoverPreview && snippet.preview && (
        <div className="absolute bottom-full left-0 mb-2 z-20">
          {getPreviewContent()}
        </div>
      )}

      <Card
        className={cn(
          "card-gradient interactive group relative transition-all duration-200",
          getCardPadding(),
          isDismissing && "card-dismissing",
          variant === 'featured' && "border-primary/20 bg-primary/10"
        )}
        style={profile === 'senior' ? {
          fontSize: `var(--zoom-text-base)`,
          padding: `var(--zoom-padding)`,
        } : undefined}
        onMouseEnter={() => setShowHoverPreview(true)}
        onMouseLeave={() => setShowHoverPreview(false)}
      >
        {/* Dismiss Button */}
        {onDismiss && (
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-muted hover:bg-destructive hover:text-destructive-foreground transition-colors opacity-0 group-hover:opacity-100 z-10"
          >
            <X className="w-3 h-3" />
          </button>
        )}

        <div className="flex items-start gap-3">
          {/* Favicon */}
          <div className="flex-shrink-0 mt-1">
            {snippet.favicon.startsWith('http') ? (
              <img 
                src={snippet.favicon} 
                alt={`${snippet.source} favicon`}
                className={cn(
                  "rounded-sm",
                  variant === 'mini' ? "w-3 h-3" : isCompact ? "w-4 h-4" : "w-5 h-5"
                )}
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" fill="%23ddd" rx="2"/></svg>';
                }}
              />
            ) : (
              <span className={cn(
                variant === 'mini' ? "text-sm" : isCompact ? "text-base" : "text-lg"
              )}>
                {snippet.favicon}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0 flex-1">
                {/* Priority indicator */}
                <div className="flex items-center gap-2 mb-1">
                  {snippet.priority === 'high' && (
                    <Badge variant="destructive" className="text-xs px-2 py-0.5">
                      <Zap className="w-3 h-3 mr-1" />
                      Urgent
                    </Badge>
                  )}
                  {snippet.intelligence?.prediction && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="text-xs px-2 py-0.5 cursor-help">
                          <Star className="w-3 h-3 mr-1" />
                          AI
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{snippet.intelligence.prediction}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>

                <h3
                  className={cn(
                    "font-semibold text-card-foreground line-clamp-2",
                    variant === 'featured' && "text-lg font-bold",
                    variant === 'mini' && "text-xs",
                    isCompact && !isSenior && "text-sm",
                    isCompact && isSenior && "text-base",
                    !isCompact && !isSenior && "text-base",
                    !isCompact && isSenior && "text-lg"
                  )}
                  style={profile === 'senior' ? {
                    fontSize: variant === 'featured' ? `var(--zoom-text-xl)` : `var(--zoom-text-lg)`
                  } : undefined}
                >
                  {/* Show persona-specific title for seniors, or original for others */}
                  {isSenior && snippet.persona_specific?.senior?.simplified_title
                    ? snippet.persona_specific.senior.simplified_title
                    : snippet.title
                  }
                </h3>

                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant="secondary" className={cn(
                    "text-xs",
                    variant === 'mini' && "text-xs px-1.5 py-0.5",
                    isSenior && "text-sm px-3 py-1",
                    snippet.intelligence?.source_type === 'open_tab' && "bg-blue-100 text-blue-800",
                    snippet.intelligence?.source_type === 'email' && "bg-green-100 text-green-800",
                    snippet.intelligence?.source_type === 'calendar' && "bg-purple-100 text-purple-800"
                  )}>
                    {snippet.source}
                  </Badge>

                  <span className={cn(
                    "text-xs text-muted-foreground",
                    variant === 'mini' && "text-xs",
                    isSenior && "text-sm"
                  )}>
                    {snippet.ts}
                  </span>

                  {/* Intelligence pattern indicator */}
                  {snippet.intelligence?.pattern && profile === 'power' && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="ghost" className="text-xs text-blue-600 cursor-help">
                          <Clock className="w-3 h-3 mr-1" />
                          Pattern
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{snippet.intelligence.pattern}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}

                  {/* Power user shortcuts */}
                  {profile === 'power' && snippet.persona_specific?.power?.shortcut && (
                    <KbdHint className="ml-auto">
                      {snippet.persona_specific.power.shortcut}
                    </KbdHint>
                  )}

                  {profile === 'power' && snippet.persona_specific?.power?.estimated_time && (
                    <span className="text-xs text-muted-foreground ml-2">
                      {snippet.persona_specific.power.estimated_time}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Excerpt - only show for default and featured variants */}
            {variant !== 'mini' && variant !== 'compact' && (
              <div className="mb-3 space-y-2">
                <p className={cn(
                  "text-muted-foreground line-clamp-2",
                  variant === 'featured' ? "text-base" : "text-sm",
                  isSenior && "text-base"
                )}>
                  {snippet.excerpt}
                </p>

                {/* Senior extra context */}
                {isSenior && snippet.persona_specific?.senior?.extra_context && (
                  <div className="p-2 bg-blue-50 border-l-4 border-blue-200 rounded-r">
                    <p className="text-sm text-blue-800">
                      💡 {snippet.persona_specific.senior.extra_context}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className={cn(
              "flex items-center gap-2 flex-wrap",
              variant === 'mini' && "gap-1"
            )}>
              {variant !== 'mini' && (
                <>
                  {/* Primary action button - context aware */}
                  <Button
                    variant="outline"
                    size={isSenior ? "default" : "sm"}
                    className={cn(
                      "tap-target",
                      isSenior && "min-h-[44px] px-4"
                    )}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    {snippet.intelligence?.source_type === 'open_tab' ? 'Switch to Tab' :
                     snippet.intelligence?.source_type === 'email' ? 'Reply' :
                     snippet.intelligence?.source_type === 'calendar' ? 'Join Meeting' :
                     'Open'}
                    {profile === 'power' && <KbdHint className="ml-1">↵</KbdHint>}
                  </Button>

                  {/* Secondary actions based on content type */}
                  {snippet.intelligence?.source_type === 'email' ? (
                    <Button
                      variant="ghost"
                      size={isSenior ? "default" : "sm"}
                      className={cn("tap-target", isSenior && "min-h-[44px] px-4")}
                    >
                      <Archive className="w-3 h-3 mr-1" />
                      Archive
                      {profile === 'power' && <KbdHint className="ml-1">A</KbdHint>}
                    </Button>
                  ) : snippet.intelligence?.source_type === 'calendar' ? (
                    <Button
                      variant="ghost"
                      size={isSenior ? "default" : "sm"}
                      className={cn("tap-target", isSenior && "min-h-[44px] px-4")}
                    >
                      <Calendar className="w-3 h-3 mr-1" />
                      Remind 5m
                      {profile === 'power' && <KbdHint className="ml-1">R</KbdHint>}
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size={isSenior ? "default" : "sm"}
                      className={cn("tap-target", isSenior && "min-h-[44px] px-4")}
                    >
                      <Pin className="w-3 h-3 mr-1" />
                      Pin
                      {profile === 'power' && <KbdHint className="ml-1">P</KbdHint>}
                    </Button>
                  )}
                </>
              )}

              <Button
                variant="default"
                size={isSenior ? "default" : variant === 'mini' ? "sm" : "sm"}
                onClick={handleDone}
                disabled={isCompleting}
                className={cn(
                  "tap-target hero-gradient",
                  variant !== 'mini' && "ml-auto",
                  variant === 'mini' && "px-2",
                  isSenior && "min-h-[44px] px-4"
                )}
              >
                <Check className={cn(
                  "w-3 h-3",
                  variant !== 'mini' && "mr-1",
                  isCompleting && "animate-pulse"
                )} />
                {variant === 'mini' ? "" :
                 isSenior ? "Complete" :
                 snippet.intelligence?.source_type === 'open_tab' ? 'Close Tab' :
                 snippet.intelligence?.source_type === 'email' ? 'Mark Read' :
                 "Done"}
                {profile === 'power' && variant !== 'mini' && <KbdHint className="ml-1">D</KbdHint>}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}