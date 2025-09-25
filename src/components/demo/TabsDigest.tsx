import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, X, Zap } from 'lucide-react';
import { usePrefsStore } from '@/store/prefsStore';
import { cn } from '@/lib/utils';

const mockTabs = [
  { id: '1', title: 'GitHub Pull Request #342', favicon: 'https://github.com/favicon.ico' },
  { id: '2', title: 'Slack - #engineering', favicon: 'https://slack.com/favicon.ico' },
  { id: '3', title: 'Figma - Mobile Design', favicon: 'https://figma.com/favicon.ico' },
  { id: '4', title: 'Linear - API Integration', favicon: 'https://linear.app/favicon.ico' },
  { id: '5', title: 'Notion - Technical Specs', favicon: 'https://notion.so/favicon.ico' },
];

export function TabsDigest() {
  const [isClosing, setIsClosing] = useState(false);
  const { openTabs, decrementTabs, incrementCalm, incCredits, profile } = usePrefsStore();

  const handleBulkClose = async () => {
    setIsClosing(true);
    
    // Simulate closing tabs
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Update metrics with confetti-like animation
    decrementTabs(5);
    incrementCalm();
    incCredits(5);
    
    setIsClosing(false);
  };

  const isSenior = profile === 'senior';

  return (
    <Card className="card-gradient">
      <div className={cn("p-4", isSenior && "p-6")}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className={cn(
              "font-semibold",
              isSenior && "text-lg"
            )}>
              Open Tabs Digest
            </h3>
          </div>
          <Badge variant="destructive" className="animate-pulse-gentle">
            {openTabs} tabs
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          {mockTabs.slice(0, isSenior ? 4 : 5).map((tab) => (
            <div 
              key={tab.id}
              className="flex items-center gap-3 p-2 rounded-lg bg-background/50 border transition-colors hover:bg-muted/30"
            >
              <img 
                src={tab.favicon} 
                alt=""
                className="w-4 h-4 rounded-sm"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" fill="%23ddd" rx="2"/></svg>';
                }}
              />
              <span className={cn(
                "text-sm font-medium truncate flex-1",
                isSenior && "text-base"
              )}>
                {tab.title}
              </span>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}

          {isSenior && openTabs > 4 && (
            <div className="text-center py-2">
              <Button variant="outline" size="sm" className="tap-target min-h-[44px]">
                Show {openTabs - 4} more tabs
              </Button>
            </div>
          )}
        </div>

        <Button 
          onClick={handleBulkClose}
          disabled={isClosing}
          className={cn(
            "w-full hero-gradient tap-target",
            isSenior && "min-h-[44px] text-base",
            isClosing && "animate-pulse"
          )}
        >
          <Zap className="w-4 h-4 mr-2" />
          {isClosing ? 'Closing tabs...' : `Close ${mockTabs.length} tabs`}
          {!isClosing && (
            <Badge variant="secondary" className="ml-2">
              +{mockTabs.length} Calm
            </Badge>
          )}
        </Button>

        {isClosing && (
          <div className="mt-2 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
              Organizing your digital space...
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}