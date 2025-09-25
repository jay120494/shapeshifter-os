import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, AlertTriangle, Coffee, Eye, Zap, TrendingUp } from 'lucide-react';
import { usePrefsStore } from '@/store/prefsStore';
import { cn } from '@/lib/utils';

interface WellnessMetrics {
  strain: number;
  breaksDue: number;
  eyeStrain: number;
  focusIntensity: number;
  recommendedBreak: string;
}

export function WellnessTracker() {
  const [metrics, setMetrics] = useState<WellnessMetrics>({
    strain: 35,
    breaksDue: 2,
    eyeStrain: 45,
    focusIntensity: 78,
    recommendedBreak: '5 min walk'
  });
  const [lastBreak, setLastBreak] = useState(Date.now() - 45 * 60 * 1000); // 45 mins ago
  const { profile, incCredits, incrementCalm } = usePrefsStore();

  const isSenior = profile === 'senior';

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        strain: Math.min(100, prev.strain + Math.random() * 2),
        eyeStrain: Math.min(100, prev.eyeStrain + Math.random() * 1.5),
        focusIntensity: Math.max(0, prev.focusIntensity + (Math.random() - 0.5) * 5)
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const takeBreak = () => {
    setLastBreak(Date.now());
    setMetrics(prev => ({
      ...prev,
      strain: Math.max(0, prev.strain - 20),
      eyeStrain: Math.max(0, prev.eyeStrain - 15),
      breaksDue: Math.max(0, prev.breaksDue - 1)
    }));
    incCredits(5);
    incrementCalm();
  };

  const getStrainLevel = (strain: number) => {
    if (strain < 30) return { level: 'Low', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-950/30' };
    if (strain < 60) return { level: 'Moderate', color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-950/30' };
    return { level: 'High', color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-950/30' };
  };

  const strainInfo = getStrainLevel(metrics.strain);
  const timeSinceBreak = Math.floor((Date.now() - lastBreak) / (1000 * 60));

  return (
    <Card className="card-gradient">
      <div className={cn("p-4", isSenior && "p-6")}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            <h3 className={cn(
              "font-semibold",
              isSenior && "text-lg"
            )}>
              Wellness Monitor
            </h3>
          </div>
          <Badge variant="outline" className={cn("gap-1", strainInfo.color)}>
            {strainInfo.level} Strain
          </Badge>
        </div>

        {/* Wellness Metrics */}
        <div className="space-y-3 mb-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-red-500" />
                Digital Strain
              </span>
              <span className={strainInfo.color}>{metrics.strain}%</span>
            </div>
            <Progress value={metrics.strain} className="h-2" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3 text-blue-500" />
                Eye Strain
              </span>
              <span className="text-blue-500">{metrics.eyeStrain}%</span>
            </div>
            <Progress value={metrics.eyeStrain} className="h-2" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-green-500" />
                Focus Intensity
              </span>
              <span className="text-green-500">{Math.round(metrics.focusIntensity)}%</span>
            </div>
            <Progress value={metrics.focusIntensity} className="h-2" />
          </div>
        </div>

        {/* Break Recommendations */}
        <div className={cn("rounded-lg p-3 mb-4", strainInfo.bg)}>
          <div className="flex items-center gap-2 mb-2">
            {metrics.strain > 60 ? (
              <AlertTriangle className="w-4 h-4 text-red-500" />
            ) : (
              <Coffee className="w-4 h-4 text-yellow-500" />
            )}
            <span className="text-sm font-medium">
              {metrics.strain > 60 ? 'Break Recommended' : 'Wellness Tip'}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {metrics.strain > 60 
              ? `High strain detected. Take a ${metrics.recommendedBreak} to reset.`
              : `Last break: ${timeSinceBreak} minutes ago. Consider a short break soon.`
            }
          </p>
        </div>

        {/* Wellness Stats Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="text-center p-2 rounded-lg bg-background/50 border">
            <div className="text-lg font-bold text-yellow-600">{timeSinceBreak}m</div>
            <div className="text-xs text-muted-foreground">Since break</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-background/50 border">
            <div className="text-lg font-bold text-blue-600">{metrics.breaksDue}</div>
            <div className="text-xs text-muted-foreground">Breaks due</div>
          </div>
        </div>

        <Button
          onClick={takeBreak}
          className="w-full hero-gradient"
          disabled={timeSinceBreak < 5}
        >
          <Coffee className="w-4 h-4 mr-2" />
          Take Wellness Break
          <Badge variant="secondary" className="ml-2">
            +5 Credits
          </Badge>
        </Button>

        {timeSinceBreak < 5 && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            You took a break recently. Next break available in {5 - timeSinceBreak} minutes.
          </p>
        )}
      </div>
    </Card>
  );
}