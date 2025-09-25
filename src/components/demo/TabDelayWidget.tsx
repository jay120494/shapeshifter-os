import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Clock,
  Archive,
  Calendar,
  Plus,
  X,
  ChevronDown,
  Timer,
  Eye,
  Pause
} from 'lucide-react';
import { usePrefsStore } from '@/store/prefsStore';
import { cn } from '@/lib/utils';

interface DelayedTab {
  id: string;
  title: string;
  url: string;
  favicon: string;
  delayUntil: Date;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

const mockDelayedTabs: DelayedTab[] = [
  {
    id: '1',
    title: 'Netflix - Continue Watching',
    url: 'netflix.com',
    favicon: '🎬',
    delayUntil: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
    reason: 'Focus time - delayed until evening',
    priority: 'low'
  },
  {
    id: '2',
    title: 'Twitter Feed',
    url: 'twitter.com',
    favicon: '🐦',
    delayUntil: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    reason: 'Social break - check after standup',
    priority: 'medium'
  },
  {
    id: '3',
    title: 'YouTube - Web Dev Tutorials',
    url: 'youtube.com',
    favicon: '📺',
    delayUntil: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours
    reason: 'Learning time - saved for lunch break',
    priority: 'medium'
  }
];

export function TabDelayWidget() {
  const [delayedTabs, setDelayedTabs] = useState<DelayedTab[]>(mockDelayedTabs);
  const [isExpanded, setIsExpanded] = useState(false);
  const { profile, incCredits } = usePrefsStore();

  const formatTimeUntil = (date: Date): string => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const restoreTab = (id: string) => {
    setDelayedTabs(prev => prev.filter(tab => tab.id !== id));
    incCredits(1);
  };

  const delayLonger = (id: string, additionalHours: number) => {
    setDelayedTabs(prev => prev.map(tab =>
      tab.id === id
        ? { ...tab, delayUntil: new Date(tab.delayUntil.getTime() + additionalHours * 60 * 60 * 1000) }
        : tab
    ));
    incCredits(1);
  };

  const removeTab = (id: string) => {
    setDelayedTabs(prev => prev.filter(tab => tab.id !== id));
    incCredits(2);
  };

  const getPriorityColor = (priority: DelayedTab['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
    }
  };

  const readyTabs = delayedTabs.filter(tab => tab.delayUntil <= new Date());
  const pendingTabs = delayedTabs.filter(tab => tab.delayUntil > new Date());

  return (
    <Card className="card-gradient">
      <div className="p-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold">Tab Queue</h3>
            {delayedTabs.length > 0 && (
              <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                {delayedTabs.length}
              </Badge>
            )}
            {readyTabs.length > 0 && (
              <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                {readyTabs.length} ready
              </Badge>
            )}
          </div>
          <ChevronDown className={cn(
            "w-4 h-4 transition-transform",
            isExpanded && "rotate-180"
          )} />
        </div>

        {!isExpanded && (
          <div className="mt-2">
            <div className="text-sm text-muted-foreground mb-2">
              Tabs saved for later • Clear your focus now
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                <Plus className="w-3 h-3 mr-1" />
                Delay Current Tab
              </Button>
            </div>
          </div>
        )}

        {isExpanded && (
          <div className="mt-4">
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {/* Ready Tabs */}
                {readyTabs.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-green-600 uppercase tracking-wide mb-2 flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      Ready to View ({readyTabs.length})
                    </div>
                    {readyTabs.map((tab) => (
                      <div key={tab.id} className="p-3 rounded-lg bg-green-50/50 border border-green-200">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{tab.favicon}</span>
                            <div className="min-w-0">
                              <div className="text-sm font-medium truncate">{tab.title}</div>
                              <div className="text-xs text-muted-foreground">{tab.url}</div>
                            </div>
                          </div>
                          <div className={cn("text-xs", getPriorityColor(tab.priority))}>
                            {tab.priority}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">{tab.reason}</div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="default"
                            className="h-6 px-2 text-xs"
                            onClick={() => restoreTab(tab.id)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Open Now
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 px-2 text-xs"
                            onClick={() => delayLonger(tab.id, 1)}
                          >
                            <Clock className="w-3 h-3 mr-1" />
                            +1h
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pending Tabs */}
                {pendingTabs.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2 flex items-center gap-1">
                      <Pause className="w-3 h-3" />
                      Delayed ({pendingTabs.length})
                    </div>
                    {pendingTabs.map((tab) => (
                      <div key={tab.id} className="p-3 rounded-lg border hover:bg-muted/30 transition-all">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg opacity-50">{tab.favicon}</span>
                            <div className="min-w-0">
                              <div className="text-sm font-medium truncate opacity-75">{tab.title}</div>
                              <div className="text-xs text-muted-foreground">{tab.url}</div>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {formatTimeUntil(tab.delayUntil)}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">{tab.reason}</div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 px-2 text-xs"
                            onClick={() => restoreTab(tab.id)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View Now
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 px-2 text-xs"
                            onClick={() => delayLonger(tab.id, 2)}
                          >
                            <Clock className="w-3 h-3 mr-1" />
                            +2h
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-1 text-xs"
                            onClick={() => removeTab(tab.id)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {delayedTabs.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    <Timer className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <div className="text-sm">No delayed tabs</div>
                    <div className="text-xs">Save tabs for later to reduce distraction</div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="mt-4 pt-3 border-t">
              <Button size="sm" variant="outline" className="w-full">
                <Plus className="w-3 h-3 mr-2" />
                Delay Current Tab
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}