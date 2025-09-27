import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Mail,
  Youtube,
  MessageSquare,
  Calendar,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Star,
  Archive,
  Reply,
  Clock,
  Play
} from 'lucide-react';
import { usePrefsStore } from '@/store/prefsStore';
import { cn } from '@/lib/utils';

type ServiceType = 'gmail' | 'youtube' | 'slack' | 'calendar';

interface ServiceData {
  gmail: {
    emails: Array<{
      id: string;
      from: string;
      subject: string;
      preview: string;
      time: string;
      unread: boolean;
      important: boolean;
    }>;
  };
  youtube: {
    videos: Array<{
      id: string;
      title: string;
      channel: string;
      thumbnail: string;
      duration: string;
      views: string;
      time: string;
    }>;
  };
  slack: {
    channels: Array<{
      id: string;
      name: string;
      lastMessage: string;
      unread: number;
      time: string;
    }>;
  };
  calendar: {
    events: Array<{
      id: string;
      title: string;
      time: string;
      attendees: number;
      location: string;
      status: 'upcoming' | 'now' | 'past';
    }>;
  };
}

interface Props {
  serviceType: ServiceType;
  title: string;
  count: number;
  className?: string;
}

const mockData: ServiceData = {
  gmail: {
    emails: [
      {
        id: '1',
        from: 'Sarah Mills',
        subject: 'Q4 Roadmap Review - Need Your Input',
        preview: 'Hi team, I need your thoughts on the proposed timeline...',
        time: '23m ago',
        unread: true,
        important: true
      },
      {
        id: '2',
        from: 'GitHub',
        subject: 'PR #247 needs review',
        preview: 'Authentication bug fix is ready for review...',
        time: '1h ago',
        unread: true,
        important: false
      },
      {
        id: '3',
        from: 'Alex Rodriguez',
        subject: 'Design system updates',
        preview: 'The new component library is ready for testing...',
        time: '2h ago',
        unread: false,
        important: false
      }
    ]
  },
  youtube: {
    videos: [
      {
        id: '1',
        title: 'React Server Components Explained',
        channel: 'Vercel',
        thumbnail: '🎬',
        duration: '12:34',
        views: '45K',
        time: '2h ago'
      },
      {
        id: '2',
        title: 'TypeScript 5.3 New Features',
        channel: 'TypeScript',
        thumbnail: '📘',
        duration: '8:42',
        views: '23K',
        time: '4h ago'
      }
    ]
  },
  slack: {
    channels: [
      {
        id: '1',
        name: '#engineering',
        lastMessage: '@you mentioned in deployment discussion',
        unread: 3,
        time: '15m ago'
      },
      {
        id: '2',
        name: '#product',
        lastMessage: 'Sprint planning updates',
        unread: 1,
        time: '1h ago'
      }
    ]
  },
  calendar: {
    events: [
      {
        id: '1',
        title: 'Team Standup',
        time: 'in 15 minutes',
        attendees: 6,
        location: 'Zoom',
        status: 'upcoming'
      },
      {
        id: '2',
        title: 'Product Review',
        time: '2:30 PM',
        attendees: 4,
        location: 'Conference Room A',
        status: 'upcoming'
      }
    ]
  }
};

export function ExpandableServiceWidget({ serviceType, title, count, className }: Props) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { profile, incLychees } = usePrefsStore();

  const getIcon = () => {
    switch (serviceType) {
      case 'gmail': return <Mail className="w-5 h-5 text-red-500" />;
      case 'youtube': return <Youtube className="w-5 h-5 text-red-600" />;
      case 'slack': return <MessageSquare className="w-5 h-5 text-purple-500" />;
      case 'calendar': return <Calendar className="w-5 h-5 text-blue-500" />;
    }
  };

  const handleAction = (action: string) => {
    incLychees(1);
    console.log(`Action: ${action}`);
  };

  const renderContent = () => {
    const data = mockData[serviceType];

    switch (serviceType) {
      case 'gmail':
        return (
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {data.emails.map((email) => (
                <div
                  key={email.id}
                  className={cn(
                    "p-3 rounded-lg border transition-all hover:bg-muted/50",
                    email.unread ? "bg-blue-50/50 border-blue-200" : "bg-background"
                  )}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-sm font-medium",
                        email.unread && "font-bold"
                      )}>
                        {email.from}
                      </span>
                      {email.important && <Star className="w-3 h-3 text-yellow-500" />}
                    </div>
                    <span className="text-xs text-muted-foreground">{email.time}</span>
                  </div>
                  <div className="text-sm font-medium mb-1">{email.subject}</div>
                  <div className="text-xs text-muted-foreground mb-2">{email.preview}</div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="h-6 px-2 text-xs" onClick={() => handleAction('reply')}>
                      <Reply className="w-3 h-3 mr-1" />
                      Reply
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={() => handleAction('archive')}>
                      <Archive className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        );

      case 'youtube':
        return (
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {data.videos.map((video) => (
                <div key={video.id} className="flex gap-3 p-2 rounded-lg hover:bg-muted/50 transition-all">
                  <div className="w-16 h-12 bg-muted rounded flex items-center justify-center text-lg">
                    {video.thumbnail}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium line-clamp-2 mb-1">{video.title}</div>
                    <div className="text-xs text-muted-foreground">{video.channel}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{video.views} views</span>
                      <span>•</span>
                      <span>{video.time}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge variant="secondary" className="text-xs">{video.duration}</Badge>
                    <Button size="sm" variant="outline" className="h-6 px-2" onClick={() => handleAction('watch')}>
                      <Play className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        );

      case 'slack':
        return (
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {data.channels.map((channel) => (
                <div key={channel.id} className="p-3 rounded-lg border hover:bg-muted/50 transition-all">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{channel.name}</span>
                    {channel.unread > 0 && (
                      <Badge variant="destructive" className="h-4 px-1.5 text-xs">
                        {channel.unread}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">{channel.lastMessage}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{channel.time}</span>
                    <Button size="sm" variant="outline" className="h-6 px-2 text-xs" onClick={() => handleAction('open')}>
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        );

      case 'calendar':
        return (
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {data.events.map((event) => (
                <div key={event.id} className="p-3 rounded-lg border hover:bg-muted/50 transition-all">
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-sm font-medium">{event.title}</span>
                    <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'} className="text-xs">
                      {event.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {event.time}
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">
                    📍 {event.location} • {event.attendees} attendees
                  </div>
                  <Button size="sm" variant="outline" className="h-6 px-2 text-xs" onClick={() => handleAction('join')}>
                    Join
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        );

      default:
        return null;
    }
  };

  return (
    <Card className={cn("card-gradient transition-all duration-300", isExpanded && "row-span-2", className)}>
      <div className="p-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            {getIcon()}
            <h3 className="font-semibold">{title}</h3>
            {count > 0 && (
              <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                {count}
              </Badge>
            )}
          </div>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>

        {!isExpanded && (
          <div className="mt-2 text-sm text-muted-foreground">
            Click to expand and see details
          </div>
        )}

        {isExpanded && (
          <div className="mt-4">
            {renderContent()}
          </div>
        )}
      </div>
    </Card>
  );
}