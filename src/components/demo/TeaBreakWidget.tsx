import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePrefsStore } from '@/store/prefsStore';
import { cn } from '@/lib/utils';
import { Leaf, CupSoda, Timer, Wind } from 'lucide-react';

const BREAK_DURATION_SECONDS = 300; // 5 minutes

export function TeaBreakWidget() {
  const { incLychees, incrementCalm } = usePrefsStore();
  const [isBrewing, setIsBrewing] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(BREAK_DURATION_SECONDS);
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
    if (!isBrewing) {
      document.body.removeAttribute('data-tea-break');
      return;
    }

    document.body.setAttribute('data-tea-break', 'active');
    const interval = window.setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          document.body.removeAttribute('data-tea-break');
          incLychees(12);
          incrementCalm();
          setIsBrewing(false);
          setShowReminder(true);
          return BREAK_DURATION_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(interval);
      document.body.removeAttribute('data-tea-break');
    };
  }, [incLychees, incrementCalm, isBrewing]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  const overlay = useMemo(() => {
    if (!isBrewing) return null;
    const steaming = secondsRemaining % 2 === 0;

    return createPortal(
      <div className="tea-break-overlay">
        <div className="tea-break-card">
          <div className="tea-break-steam">
            <span className={cn('steam-line', steaming && 'steam-line-active')} />
            <span className={cn('steam-line delay', steaming && 'steam-line-active')} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Tea Ceremony in Progress</h2>
          <p className="text-muted-foreground mb-4">Step away from the screen, stretch, and brew a fresh cup. Bao OS will be here when you return.</p>
          <div className="text-4xl font-semibold mb-4">{minutes}:{seconds.toString().padStart(2, '0')}</div>
          <div className="flex gap-3">
            <Button variant="default" onClick={() => setSecondsRemaining((prev) => Math.min(prev + 60, BREAK_DURATION_SECONDS))}>+ 1 min</Button>
            <Button variant="outline" onClick={() => { setIsBrewing(false); setSecondsRemaining(BREAK_DURATION_SECONDS); }}>End Break</Button>
          </div>
        </div>
      </div>,
      document.body
    );
  }, [isBrewing, minutes, seconds, secondsRemaining]);

  return (
    <Card className="card-gradient p-4 rounded-2xl space-y-4 relative overflow-hidden">
      {overlay}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg">Tea Time Ritual</h3>
          <p className="text-sm text-muted-foreground">Protect your calm with intentional breaks and mindful sipping.</p>
        </div>
        <Badge variant="secondary" className="gap-1">
          <Timer className="w-3 h-3" /> 5 min
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-muted/50 border p-3 flex items-center gap-3">
          <CupSoda className="w-5 h-5 text-amber-500" />
          <div>
            <p className="font-medium">Brewing guide</p>
            <p className="text-muted-foreground">Jasmine tea, 80C water, 3 minutes</p>
          </div>
        </div>
        <div className="rounded-xl bg-muted/50 border p-3 flex items-center gap-3">
          <Leaf className="w-5 h-5 text-green-500" />
          <div>
            <p className="font-medium">Mindful reminder</p>
            <p className="text-muted-foreground">Look away from screens, open a window, stretch</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button
          size="sm"
          className="gap-2 bg-gradient-warm hover:opacity-90"
          onClick={() => {
            setIsBrewing(true);
            setSecondsRemaining(BREAK_DURATION_SECONDS);
            setShowReminder(false);
          }}
          disabled={isBrewing}
        >
          <Wind className="w-4 h-4" />
          {isBrewing ? 'Brewing...' : 'Start Tea Break'}
        </Button>
        <div className="text-xs text-muted-foreground">Bao OS silences notifications while you sip.</div>
      </div>

      {showReminder && (
        <div className="mt-3 rounded-xl border border-dashed p-3 bg-background/80 text-sm">
          Break complete! Enjoy +12 lychees and a calmer focus score. Ready for the next steep?
        </div>
      )}
    </Card>
  );
}
