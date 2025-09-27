import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Cookie, Gift, Sparkles } from 'lucide-react';
import { usePrefsStore } from '@/store/prefsStore';
import { cn } from '@/lib/utils';

// Fortune rewards will be implemented later

export function FortuneCookieWidget() {
  const { lychees, profile } = usePrefsStore();
  const [isOpening, setIsOpening] = useState(false);
  const [showReward, setShowReward] = useState(false);

  const isSenior = profile === 'senior';
  const availableCookies = Math.floor(lychees / 100);

  const openFortuneCookie = () => {
    if (availableCookies <= 0) return;
    setIsOpening(true);
    setTimeout(() => {
      setIsOpening(false);
      setShowReward(true);
      setTimeout(() => setShowReward(false), 3000);
    }, 1000);
  };

  const progress = (lychees % 100);
  const nextMilestone = Math.floor(lychees / 100) * 100 + 100;

  // Show widget if close to milestone or have cookies
  if (availableCookies === 0 && progress < 50) {
    return null;
  }

  return (
    <Card className="card-gradient border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
      <div className={cn("p-4", isSenior && "p-6")}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Cookie className="w-5 h-5 text-amber-600" />
            <h3 className={cn(
              "font-semibold text-amber-800 dark:text-amber-200",
              isSenior && "text-lg"
            )}>
              Fortune Cookies
            </h3>
          </div>
          {availableCookies > 0 && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 gap-1">
              <Gift className="w-3 h-3" />
              {availableCookies}
            </Badge>
          )}
        </div>

        {showReward && (
          <div className="mb-4 p-4 rounded-lg bg-gradient-achievement text-white text-center">
            <div className="text-2xl mb-2">🎉</div>
            <div className="font-semibold mb-1">Lucky reward!</div>
            <div className="text-sm opacity-90">+50 Lychees!</div>
          </div>
        )}

        {availableCookies > 0 ? (
          <div className="text-center">
            <div className="mb-4">
              <div className="text-2xl mb-2">🥠</div>
              <p className="text-sm text-amber-700 dark:text-amber-300 mb-4">
                You've earned a fortune cookie! Open it to reveal your reward.
              </p>
            </div>

            <Button
              onClick={openFortuneCookie}
              disabled={isOpening}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
            >
              {isOpening ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Opening...
                </>
              ) : (
                <>
                  <Cookie className="w-4 h-4 mr-2" />
                  Open Fortune Cookie
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-4">
              <div className="text-lg opacity-60 mb-2">🥠</div>
              <p className="text-sm text-amber-700 dark:text-amber-300 mb-2">
                Earn a fortune cookie every 100 Lychees!
              </p>
              <div className="text-xs text-muted-foreground">
                {lychees} / {nextMilestone} Lychees
              </div>
            </div>

            <div className="w-full bg-amber-200 dark:bg-amber-900 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-4 p-3 rounded-lg bg-amber-100 dark:bg-amber-950/30">
          <div className="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-200">
            <Cookie className="w-4 h-4" />
            <span>Possible rewards: Bonus Lychees, Special Features, Themes & More!</span>
          </div>
        </div>
      </div>
    </Card>
  );
}