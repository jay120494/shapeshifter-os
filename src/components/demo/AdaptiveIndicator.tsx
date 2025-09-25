import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Brain,
  Clock,
  Eye,
  Zap,
  Heart,
  TrendingUp,
  Shuffle,
  User,
  Settings
} from 'lucide-react';
import { usePrefsStore } from '@/store/prefsStore';
import { cn } from '@/lib/utils';

interface AdaptationEvent {
  id: string;
  type: 'layout' | 'priority' | 'content' | 'timing' | 'interface';
  title: string;
  description: string;
  timestamp: Date;
  impact: 'high' | 'medium' | 'low';
}

const mockAdaptations: AdaptationEvent[] = [
  {
    id: '1',
    type: 'priority',
    title: 'Morning Focus Shift',
    description: 'Moved emails to top priority based on 9 AM check pattern',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    impact: 'high'
  },
  {
    id: '2',
    type: 'layout',
    title: 'Widget Reorganization',
    description: 'Expanded GitHub widget - used 3x more this week',
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    impact: 'medium'
  },
  {
    id: '3',
    type: 'content',
    title: 'Content Filtering',
    description: 'Hiding social media - Focus Mode active until 6 PM',
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    impact: 'medium'
  },
  {
    id: '4',
    type: 'interface',
    title: 'Senior Mode Activated',
    description: 'Increased text size and spacing for better readability',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    impact: 'high'
  }
];

export function AdaptiveIndicator() {
  const [adaptations, setAdaptations] = useState<AdaptationEvent[]>(mockAdaptations);
  const [isLearning, setIsLearning] = useState(false);
  const { profile, dayMode } = usePrefsStore();

  // Simulate real-time adaptations
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every 10 seconds
        const newAdaptation: AdaptationEvent = {
          id: Date.now().toString(),
          type: ['layout', 'priority', 'content', 'timing'][Math.floor(Math.random() * 4)] as any,
          title: 'Smart Adjustment',
          description: 'Shapeshifter adapted to your workflow',
          timestamp: new Date(),
          impact: 'medium'
        };

        setAdaptations(prev => [newAdaptation, ...prev.slice(0, 4)]);
        setIsLearning(true);
        setTimeout(() => setIsLearning(false), 2000);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: AdaptationEvent['type']) => {
    switch (type) {
      case 'layout': return <Shuffle className="w-3 h-3" />;
      case 'priority': return <TrendingUp className="w-3 h-3" />;
      case 'content': return <Eye className="w-3 h-3" />;
      case 'timing': return <Clock className="w-3 h-3" />;
      case 'interface': return <User className="w-3 h-3" />;
    }
  };

  const getImpactColor = (impact: AdaptationEvent['impact']) => {
    switch (impact) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'just now';
  };

  return (
    <Card className="card-gradient">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Brain className={cn(
              "w-5 h-5 transition-all duration-500",
              isLearning ? "text-blue-500 animate-pulse" : "text-purple-500"
            )} />
            <h3 className="font-semibold">AI Adaptation</h3>
            {isLearning && (
              <Badge variant="secondary" className="animate-pulse">
                Learning...
              </Badge>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {profile} • {dayMode}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {adaptations.slice(0, 3).map((adaptation) => (
            <div
              key={adaptation.id}
              className="flex items-start gap-2 p-2 rounded-lg bg-muted/20 border text-xs"
            >
              <div className={cn("mt-0.5", getImpactColor(adaptation.impact))}>
                {getIcon(adaptation.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{adaptation.title}</div>
                <div className="text-muted-foreground truncate">{adaptation.description}</div>
              </div>
              <div className="text-muted-foreground whitespace-nowrap">
                {formatTimeAgo(adaptation.timestamp)}
              </div>
            </div>
          ))}
        </div>

        {/* Learning Stats */}
        <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
          <div className="text-center p-2 rounded bg-background/50 border">
            <div className="font-bold text-blue-500">47</div>
            <div className="text-muted-foreground">Learned</div>
          </div>
          <div className="text-center p-2 rounded bg-background/50 border">
            <div className="font-bold text-green-500">12</div>
            <div className="text-muted-foreground">Optimized</div>
          </div>
          <div className="text-center p-2 rounded bg-background/50 border">
            <div className="font-bold text-purple-500">98%</div>
            <div className="text-muted-foreground">Accuracy</div>
          </div>
        </div>

        {/* Current Focus */}
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">Currently Optimizing</div>
          <div className="flex items-center justify-center gap-1 text-xs">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="font-medium">
              {profile === 'senior' ? 'Readability & Accessibility' :
               profile === 'power' ? 'Workflow Efficiency' :
               'Content Prioritization'}
            </span>
          </div>
        </div>

        {/* Manual Override Button */}
        <div className="mt-3 pt-3 border-t">
          <Button size="sm" variant="outline" className="w-full text-xs">
            <Settings className="w-3 h-3 mr-1" />
            Adaptation Settings
          </Button>
        </div>
      </div>
    </Card>
  );
}