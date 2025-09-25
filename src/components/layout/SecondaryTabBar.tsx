import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { User, Calendar } from 'lucide-react';
import { usePrefsStore, Profile, DayMode } from '@/store/prefsStore';
import { Container } from './Container';
import { cn } from '@/lib/utils';

export function SecondaryTabBar() {
  const { profile, dayMode, setProfile, setDayMode } = usePrefsStore();

  return (
    <div className="border-b bg-muted/30">
      <Container>
        <div className="flex h-12 items-center justify-center gap-16">
          {/* Profile Toggle */}
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Profile:</span>
            <div className="flex rounded-lg bg-background border p-1">
              {(['senior', 'default', 'power'] as const).map((p) => (
                <Tooltip key={p}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={profile === p ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setProfile(p)}
                      className={cn(
                        "text-xs px-3 py-1",
                        profile === p && "hero-gradient shadow-sm"
                      )}
                    >
                      {p === 'senior' && 'Senior'}
                      {p === 'default' && 'Default'}
                      {p === 'power' && 'Power'}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {p === 'senior' && 'Larger text, high contrast, reduced motion for accessibility'}
                      {p === 'default' && 'Balanced interface designed for most users'}
                      {p === 'power' && 'Compact density with keyboard shortcuts for power users'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>

          {/* Day Mode Toggle */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Mode:</span>
            <div className="flex rounded-lg bg-background border p-1">
              {(['workday', 'weekend'] as const).map((mode) => (
                <Tooltip key={mode}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={dayMode === mode ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setDayMode(mode)}
                      className={cn(
                        "text-xs px-3 py-1",
                        dayMode === mode && "hero-gradient shadow-sm"
                      )}
                    >
                      {mode === 'workday' ? 'Workday' : 'Weekend'}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {mode === 'workday' && 'Show work-focused tasks and productivity features'}
                      {mode === 'weekend' && 'Show personal tasks and leisure activities'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}