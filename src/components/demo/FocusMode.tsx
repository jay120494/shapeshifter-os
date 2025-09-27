import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Brain, Clock, Zap, Target, Bell, X, Timer } from 'lucide-react';
import { usePrefsStore } from '@/store/prefsStore';
import { cn } from '@/lib/utils';

export function FocusMode() {
  const [focusEnabled, setFocusEnabled] = useState(false);
  const [focusTimer, setFocusTimer] = useState(25 * 60); // 25 minutes
  const [sessionProgress, setSessionProgress] = useState(0);
  const [blockedNotifications, setBlockedNotifications] = useState(0);
  const { incLychees, incrementCalm, profile } = usePrefsStore();

  const isSenior = profile === 'senior';

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (focusEnabled && focusTimer > 0) {
      interval = setInterval(() => {
        setFocusTimer(prev => prev - 1);
        setSessionProgress(prev => Math.min(100, prev + (100 / (25 * 60))));
        
        // Simulate blocking notifications
        if (Math.random() > 0.95) {
          setBlockedNotifications(prev => prev + 1);
        }
      }, 1000);
    } else if (focusTimer === 0 && focusEnabled) {
      // Session completed
      incLychees(15);
      incrementCalm();
      setFocusEnabled(false);
      setFocusTimer(25 * 60);
      setSessionProgress(0);
    }
    
    return () => clearInterval(interval);
  }, [focusEnabled, focusTimer, incLychees, incrementCalm]);

  const startFocusSession = () => {
    setFocusEnabled(true);
    setSessionProgress(0);
    setBlockedNotifications(0);
  };

  const stopFocusSession = () => {
    setFocusEnabled(false);
    setFocusTimer(25 * 60);
    setSessionProgress(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={cn(
      "card-gradient transition-all duration-300",
      focusEnabled && "ring-2 ring-blue-500 shadow-lg"
    )}>
      <div className={cn("p-4", isSenior && "p-6")}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-500" />
            <h3 className={cn(
              "font-semibold",
              isSenior && "text-lg"
            )}>
              Focus Mode
            </h3>
          </div>
          <Switch
            checked={focusEnabled}
            onCheckedChange={focusEnabled ? stopFocusSession : startFocusSession}
          />
        </div>

        {focusEnabled ? (
          <div className="space-y-4">
            {/* Timer Display */}
            <div className="text-center">
              <div className="text-3xl font-mono font-bold text-blue-600 mb-2">
                {formatTime(focusTimer)}
              </div>
              <Progress value={sessionProgress} className="mb-2" />
              <div className="text-sm text-muted-foreground">
                Deep work session in progress
              </div>
            </div>

            {/* Focus Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                <Bell className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                <div className="text-sm font-medium">{blockedNotifications}</div>
                <div className="text-xs text-muted-foreground">Blocked</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-green-50 dark:bg-green-950/30">
                <Target className="w-4 h-4 text-green-500 mx-auto mb-1" />
                <div className="text-sm font-medium">{Math.floor(sessionProgress)}%</div>
                <div className="text-xs text-muted-foreground">Progress</div>
              </div>
            </div>

            <Button
              onClick={stopFocusSession}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <X className="w-4 h-4 mr-2" />
              End Session
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className={cn(
                "text-muted-foreground",
                isSenior ? "text-base" : "text-sm"
              )}>
                Start a focused work session
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Session length</span>
                <Badge variant="outline">25 min</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Notifications</span>
                <Badge variant="outline">Blocked</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Reward</span>
                <Badge variant="outline" className="gap-1">
                  <Zap className="w-3 h-3" />
                  +15 Lychees 🍇
                </Badge>
              </div>
            </div>

            <Button
              onClick={startFocusSession}
              className="w-full hero-gradient"
            >
              <Timer className="w-4 h-4 mr-2" />
              Start Focus Session
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}