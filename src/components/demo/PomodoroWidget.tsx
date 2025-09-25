import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Play,
  Pause,
  Square,
  Coffee,
  Target,
  Clock,
  CheckCircle
} from 'lucide-react';
import { usePrefsStore } from '@/store/prefsStore';
import { cn } from '@/lib/utils';

type PomodoroState = 'idle' | 'working' | 'break' | 'paused';

export function PomodoroWidget() {
  const [state, setState] = useState<PomodoroState>('idle');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isBreak, setIsBreak] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(2);
  const { profile, incCredits, incrementCalm } = usePrefsStore();

  const workDuration = 25 * 60; // 25 minutes
  const breakDuration = 5 * 60; // 5 minutes

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (state === 'working' || state === 'break') {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            if (state === 'working') {
              // Work session completed
              setCompletedPomodoros(prev => prev + 1);
              setState('break');
              setIsBreak(true);
              setTimeLeft(breakDuration);
              incCredits(10);
              incrementCalm();
              return breakDuration;
            } else {
              // Break completed
              setState('idle');
              setIsBreak(false);
              setTimeLeft(workDuration);
              return workDuration;
            }
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state, incCredits, incrementCalm]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (state === 'idle') {
      setState('working');
      setIsBreak(false);
    } else if (state === 'paused') {
      setState(isBreak ? 'break' : 'working');
    }
  };

  const handlePause = () => {
    setState('paused');
  };

  const handleStop = () => {
    setState('idle');
    setIsBreak(false);
    setTimeLeft(workDuration);
  };

  const getProgress = () => {
    const totalTime = isBreak ? breakDuration : workDuration;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const getStateColor = () => {
    switch (state) {
      case 'working': return 'text-red-500';
      case 'break': return 'text-green-500';
      case 'paused': return 'text-yellow-500';
      default: return 'text-muted-foreground';
    }
  };

  const getStateIcon = () => {
    switch (state) {
      case 'working': return <Target className="w-4 h-4" />;
      case 'break': return <Coffee className="w-4 h-4" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <Card className="card-gradient">
      <div className={cn("p-4", profile === 'senior' && "p-6")}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={getStateColor()}>
              {getStateIcon()}
            </div>
            <h3 className={cn("font-semibold", profile === 'senior' && "text-lg")}>
              Pomodoro Timer
            </h3>
          </div>
          <Badge variant="outline" className={cn("text-xs", getStateColor())}>
            {state === 'working' ? 'Focus Time' :
             state === 'break' ? 'Break Time' :
             state === 'paused' ? 'Paused' : 'Ready'}
          </Badge>
        </div>

        {/* Timer Display */}
        <div className="text-center mb-4">
          <div className={cn(
            "text-4xl font-mono font-bold mb-2",
            profile === 'senior' && "text-5xl",
            getStateColor()
          )}>
            {formatTime(timeLeft)}
          </div>

          <div className="mb-3">
            <Progress
              value={getProgress()}
              className={cn(
                "h-2 transition-all duration-1000",
                profile === 'senior' && "h-3"
              )}
            />
          </div>

          <div className="text-sm text-muted-foreground">
            {state === 'working' ? 'Stay focused!' :
             state === 'break' ? 'Take a break!' :
             state === 'paused' ? 'Timer paused' :
             'Ready to start focusing?'}
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2 mb-4 justify-center">
          {state === 'idle' || state === 'paused' ? (
            <Button
              onClick={handleStart}
              className={cn(
                "hero-gradient",
                profile === 'senior' && "min-h-[44px] px-4"
              )}
            >
              <Play className="w-4 h-4 mr-2" />
              {state === 'paused' ? 'Resume' : 'Start Focus'}
            </Button>
          ) : (
            <Button
              onClick={handlePause}
              variant="outline"
              className={cn(profile === 'senior' && "min-h-[44px] px-4")}
            >
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          )}

          {state !== 'idle' && (
            <Button
              onClick={handleStop}
              variant="ghost"
              className={cn(profile === 'senior' && "min-h-[44px] px-4")}
            >
              <Square className="w-4 h-4 mr-2" />
              Stop
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-center p-2 rounded bg-background/50 border">
            <div className="font-bold text-green-500">{completedPomodoros}</div>
            <div className="text-muted-foreground">Completed Today</div>
          </div>
          <div className="text-center p-2 rounded bg-background/50 border">
            <div className="font-bold text-blue-500">{completedPomodoros * 25}m</div>
            <div className="text-muted-foreground">Focus Time</div>
          </div>
        </div>

        {state === 'idle' && (
          <div className="mt-3 text-center">
            <div className="text-xs text-muted-foreground">
              💡 25 min focus + 5 min break • Earn 10 credits per session
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}