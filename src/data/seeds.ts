export interface SnippetData {
  id: string;
  title: string;
  source: string;
  url: string;
  excerpt: string;
  ts: string;
  favicon: string;
  category: 'today' | 'patterns' | 'snippets';
  priority?: 'high' | 'medium' | 'low';
  intelligence?: {
    pattern?: string; // "Usually opened at 9:30am" | "Opened 3x this week"
    prediction?: string; // "High priority based on your patterns"
    source_type?: 'open_tab' | 'email' | 'calendar' | 'rss' | 'bookmark';
  };
  persona_specific?: {
    senior?: { simplified_title?: string; extra_context?: string };
    power?: { shortcut?: string; estimated_time?: string };
  };
  preview?: {
    details?: string;
    context?: string;
    actions?: string[];
    metadata?: { [key: string]: string };
  };
}

const getFavicon = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;

// Time-based helpers for dynamic timestamps
const getTimeAgo = (minutes: number) => {
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
};

const getCurrentTimeSlot = () => {
  const hour = new Date().getHours();
  if (hour < 9) return 'early';
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};

const getUrgencyScore = (timeSlot: string, category: string) => {
  // Higher scores = more urgent for current time
  const urgencyMatrix = {
    early: { email: 3, calendar: 5, open_tab: 2 },
    morning: { email: 5, calendar: 4, open_tab: 5 },
    afternoon: { email: 4, calendar: 3, open_tab: 4 },
    evening: { email: 2, calendar: 2, open_tab: 3 }
  };
  return urgencyMatrix[timeSlot as keyof typeof urgencyMatrix]?.[category as keyof typeof urgencyMatrix.early] || 3;
};

export const workdayData: Record<string, SnippetData[]> = {
  today: [
    {
      id: 'open-tab-1',
      title: 'GitHub PR #247 - Authentication Bug Fix',
      source: 'Open Tab',
      url: '#',
      excerpt: `Been open for ${getTimeAgo(183)} - merge conflicts need resolution`,
      ts: `Tab open ${getTimeAgo(183)}`,
      favicon: getFavicon('github.com'),
      category: 'today',
      priority: 'high',
      intelligence: {
        pattern: 'Usually review PRs at 9:30am',
        prediction: `${getCurrentTimeSlot() === 'morning' ? 'Perfect timing' : 'High priority'} - blocking team deployment`,
        source_type: 'open_tab'
      },
      persona_specific: {
        senior: {
          simplified_title: 'Fix login issue on GitHub',
          extra_context: 'This will help other team members continue their work'
        },
        power: {
          shortcut: '⌘+1',
          estimated_time: '15 min'
        }
      },
      preview: {
        details: '3 files changed: auth.js (12 lines), middleware.js (5 lines), tests.spec.js (8 lines)',
        context: 'Fixes OAuth callback issue causing 401 errors for new user signups',
        actions: ['Review changes', 'Run tests', 'Approve & merge'],
        metadata: {
          'Branch': 'fix/oauth-callback',
          'Approvals': '2 of 2 required',
          'Checks': 'All passing',
          'Conflicts': 'auth.js line 34-37'
        }
      }
    },
    {
      id: 'email-urgent',
      title: '3 unread emails - 1 urgent from Sarah',
      source: 'Gmail',
      url: '#',
      excerpt: `Q4 roadmap needs your input by ${getCurrentTimeSlot() === 'morning' ? '2pm today' : getCurrentTimeSlot() === 'afternoon' ? 'end of day' : 'tomorrow morning'}`,
      ts: `${getTimeAgo(23)}`,
      favicon: getFavicon('gmail.com'),
      category: 'today',
      priority: 'high',
      intelligence: {
        pattern: 'Check email 2x daily',
        prediction: `${getCurrentTimeSlot() === 'morning' ? 'Good timing for response' : 'Urgent response needed'}`,
        source_type: 'email'
      },
      persona_specific: {
        senior: {
          simplified_title: 'Important message from Sarah',
          extra_context: 'About quarterly planning - needs response today'
        },
        power: {
          shortcut: '⌘+2',
          estimated_time: '5 min'
        }
      },
      preview: {
        details: 'From: Sarah Mills (Product Director) • Subject: Q4 Roadmap Review - Need Your Input',
        context: 'Budget allocation decisions, timeline concerns for mobile app launch, resource planning discussion',
        actions: ['Reply with priorities', 'Schedule call', 'Review attached docs'],
        metadata: {
          'Thread': '4 messages',
          'Attachments': '2 (Q4-Budget.xlsx, Timeline.pdf)',
          'Cc': 'Mike Chen, Alex Rodriguez',
          'Deadline': `${getCurrentTimeSlot() === 'morning' ? '2pm today' : 'end of day'}`
        }
      }
    },
    {
      id: 'calendar-next',
      title: `Team standup ${getCurrentTimeSlot() === 'morning' ? 'in 15 minutes' : getCurrentTimeSlot() === 'afternoon' ? 'at 2:30 PM' : 'tomorrow 9:30 AM'}`,
      source: 'Calendar',
      url: '#',
      excerpt: 'Weekly sync with product team - prep: demo progress',
      ts: getCurrentTimeSlot() === 'morning' ? '9:45 AM' : getCurrentTimeSlot() === 'afternoon' ? '2:30 PM today' : '9:30 AM tomorrow',
      favicon: getFavicon('calendar.google.com'),
      category: 'today',
      priority: getCurrentTimeSlot() === 'morning' ? 'high' : 'medium',
      intelligence: {
        pattern: 'Never missed a standup',
        prediction: getCurrentTimeSlot() === 'morning' ? 'Time to prep talking points now!' : 'Time to prep talking points',
        source_type: 'calendar'
      },
      persona_specific: {
        senior: {
          simplified_title: getCurrentTimeSlot() === 'morning' ? 'Team meeting starts very soon' : 'Team meeting coming up',
          extra_context: getCurrentTimeSlot() === 'morning' ? 'Join video call in 15 minutes' : 'Prepare for upcoming meeting'
        },
        power: {
          shortcut: '⌘+3',
          estimated_time: '30 min'
        }
      }
    },
    {
      id: 'notion-1',
      title: 'Design System v2.0 spec updated',
      source: 'Notion',
      url: '#',
      excerpt: 'New component variants and accessibility guidelines added',
      ts: getTimeAgo(1435), // Yesterday
      favicon: getFavicon('notion.so'),
      category: 'today',
      priority: getCurrentTimeSlot() === 'afternoon' ? 'medium' : 'low',
    },
    {
      id: 'slack-1',
      title: 'Deployment pipeline discussion',
      source: 'Slack',
      url: '#',
      excerpt: '@you mentioned in #engineering - Docker optimization thread',
      ts: getTimeAgo(127), // ~2 hours ago
      favicon: getFavicon('slack.com'),
      category: 'today',
      intelligence: {
        source_type: 'open_tab',
        pattern: `Usually responds to Slack during ${getCurrentTimeSlot()}`,
        prediction: getCurrentTimeSlot() === 'evening' ? 'Can wait until tomorrow' : 'Quick response expected'
      },
    },
    {
      id: 'jira-1',
      title: 'User dashboard performance issue',
      source: 'Jira',
      url: '#',
      excerpt: 'High priority bug affecting 15% of active users',
      ts: '1 hour ago',
      favicon: getFavicon('atlassian.com'),
      category: 'today',
    },
    {
      id: 'figma-1',
      title: 'Mobile navigation prototype',
      source: 'Figma',
      url: '#',
      excerpt: 'New designs for iOS and Android app navigation',
      ts: '3 hours ago',
      favicon: getFavicon('figma.com'),
      category: 'today',
    },
    {
      id: 'linear-1',
      title: 'API rate limiting implementation',
      source: 'Linear',
      url: '#',
      excerpt: 'Spike task for Redis-based rate limiting strategy',
      ts: '4 hours ago',
      favicon: getFavicon('linear.app'),
      category: 'today',
    },
  ],
  patterns: [
    {
      id: 'github-pattern',
      title: 'GitHub PR Reviews',
      source: 'GitHub',
      url: '#',
      excerpt: 'You typically review 3-5 PRs each morning',
      ts: 'Daily at 9 AM',
      favicon: getFavicon('github.com'),
      category: 'patterns',
    },
    {
      id: 'slack-pattern',
      title: 'Team Check-ins',
      source: 'Slack',
      url: '#',
      excerpt: 'Regular updates in #engineering and #product channels',
      ts: 'Every 2 hours',
      favicon: getFavicon('slack.com'),
      category: 'patterns',
    },
    {
      id: 'docs-pattern',
      title: 'Documentation Updates',
      source: 'Notion',
      url: '#',
      excerpt: 'Weekly updates to technical specifications',
      ts: 'Wednesdays',
      favicon: getFavicon('notion.so'),
      category: 'patterns',
    },
    {
      id: 'metrics-pattern',
      title: 'Performance Monitoring',
      source: 'DataDog',
      url: '#',
      excerpt: 'Daily dashboard review for system health',
      ts: 'Daily at 10 AM',
      favicon: getFavicon('datadoghq.com'),
      category: 'patterns',
    },
    {
      id: 'code-pattern',
      title: 'Feature Development',
      source: 'VS Code',
      url: '#',
      excerpt: 'Deep focus coding sessions, usually 2-3 hours',
      ts: 'Mornings',
      favicon: getFavicon('code.visualstudio.com'),
      category: 'patterns',
    },
    {
      id: 'design-pattern',
      title: 'Design Reviews',
      source: 'Figma',
      url: '#',
      excerpt: 'Weekly design critique sessions with the team',
      ts: 'Fridays at 2 PM',
      favicon: getFavicon('figma.com'),
      category: 'patterns',
    },
    {
      id: 'email-pattern',
      title: 'Email Batch Processing',
      source: 'Gmail',
      url: '#',
      excerpt: 'Process inbox twice daily to maintain focus',
      ts: '9 AM & 4 PM',
      favicon: getFavicon('gmail.com'),
      category: 'patterns',
    },
    {
      id: 'planning-pattern',
      title: 'Sprint Planning',
      source: 'Linear',
      url: '#',
      excerpt: 'Bi-weekly planning sessions for upcoming features',
      ts: 'Every other Monday',
      favicon: getFavicon('linear.app'),
      category: 'patterns',
    },
  ],
  snippets: [
    {
      id: 'so-1',
      title: 'React useCallback optimization patterns',
      source: 'Stack Overflow',
      url: '#',
      excerpt: 'Best practices for preventing unnecessary re-renders in complex components',
      ts: '5 min read',
      favicon: getFavicon('stackoverflow.com'),
      category: 'snippets',
    },
    {
      id: 'medium-1',
      title: 'TypeScript 5.0 new features deep dive',
      source: 'Medium',
      url: '#',
      excerpt: 'Exploring const assertions, template literal types, and decorators',
      ts: '8 min read',
      favicon: getFavicon('medium.com'),
      category: 'snippets',
    },
    {
      id: 'dev-1',
      title: 'Building scalable CSS architectures',
      source: 'Dev.to',
      url: '#',
      excerpt: 'CSS-in-JS vs utility-first approaches for large applications',
      ts: '6 min read',
      favicon: getFavicon('dev.to'),
      category: 'snippets',
    },
    {
      id: 'github-guide',
      title: 'Git workflow optimization guide',
      source: 'GitHub',
      url: '#',
      excerpt: 'Advanced branching strategies for team collaboration',
      ts: '4 min read',
      favicon: getFavicon('github.com'),
      category: 'snippets',
    },
    {
      id: 'aws-1',
      title: 'Serverless architecture patterns',
      source: 'AWS Blog',
      url: '#',
      excerpt: 'Lambda best practices for high-performance applications',
      ts: '7 min read',
      favicon: getFavicon('aws.amazon.com'),
      category: 'snippets',
    },
    {
      id: 'vercel-1',
      title: 'Next.js 14 app router migration',
      source: 'Vercel',
      url: '#',
      excerpt: 'Step-by-step guide to upgrading from pages router',
      ts: '10 min read',
      favicon: getFavicon('vercel.com'),
      category: 'snippets',
    },
    {
      id: 'tailwind-1',
      title: 'Advanced Tailwind CSS techniques',
      source: 'Tailwind Labs',
      url: '#',
      excerpt: 'Custom utility classes and component composition strategies',
      ts: '5 min read',
      favicon: getFavicon('tailwindcss.com'),
      category: 'snippets',
    },
    {
      id: 'docker-1',
      title: 'Docker optimization for Node.js apps',
      source: 'Docker Blog',
      url: '#',
      excerpt: 'Multi-stage builds and layer caching for faster deployments',
      ts: '6 min read',
      favicon: getFavicon('docker.com'),
      category: 'snippets',
    },
    {
      id: 'redis-1',
      title: 'Redis caching strategies for APIs',
      source: 'Redis Labs',
      url: '#',
      excerpt: 'Cache-aside, write-through, and write-behind patterns',
      ts: '8 min read',
      favicon: getFavicon('redis.io'),
      category: 'snippets',
    },
    {
      id: 'postgres-1',
      title: 'PostgreSQL query optimization',
      source: 'PostgreSQL Wiki',
      url: '#',
      excerpt: 'Index strategies and query planning for better performance',
      ts: '9 min read',
      favicon: getFavicon('postgresql.org'),
      category: 'snippets',
    },
    {
      id: 'kubernetes-1',
      title: 'Kubernetes deployment best practices',
      source: 'CNCF',
      url: '#',
      excerpt: 'Resource management and rolling updates for production',
      ts: '12 min read',
      favicon: getFavicon('kubernetes.io'),
      category: 'snippets',
    },
    {
      id: 'testing-1',
      title: 'End-to-end testing with Playwright',
      source: 'Microsoft',
      url: '#',
      excerpt: 'Cross-browser testing strategies for modern web apps',
      ts: '7 min read',
      favicon: getFavicon('playwright.dev'),
      category: 'snippets',
    },
    {
      id: 'monitoring-1',
      title: 'Application observability with OpenTelemetry',
      source: 'OpenTelemetry',
      url: '#',
      excerpt: 'Distributed tracing and metrics collection patterns',
      ts: '11 min read',
      favicon: getFavicon('opentelemetry.io'),
      category: 'snippets',
    },
    {
      id: 'security-1',
      title: 'Web security headers checklist',
      source: 'OWASP',
      url: '#',
      excerpt: 'Essential HTTP headers for protecting web applications',
      ts: '4 min read',
      favicon: getFavicon('owasp.org'),
      category: 'snippets',
    },
    {
      id: 'performance-1',
      title: 'Web vitals optimization techniques',
      source: 'Google Developers',
      url: '#',
      excerpt: 'Improving Core Web Vitals scores for better user experience',
      ts: '6 min read',
      favicon: getFavicon('developers.google.com'),
      category: 'snippets',
    },
    {
      id: 'accessibility-1',
      title: 'ARIA patterns for complex widgets',
      source: 'W3C',
      url: '#',
      excerpt: 'Implementing accessible dropdown menus and modal dialogs',
      ts: '8 min read',
      favicon: getFavicon('w3.org'),
      category: 'snippets',
    },
  ],
};

export const weekendData: Record<string, SnippetData[]> = {
  today: [
    {
      id: 'youtube-1',
      title: 'The Art of Code - Documentary',
      source: 'YouTube',
      url: '#',
      excerpt: 'Exploring the creative side of programming with industry leaders',
      ts: '42 min',
      favicon: getFavicon('youtube.com'),
      category: 'today',
    },
    {
      id: 'recipe-1',
      title: 'Weekend Brunch Recipe Collection',
      source: 'Bon Appétit',
      url: '#',
      excerpt: 'Five elevated brunch dishes to impress your guests',
      ts: '15 min read',
      favicon: getFavicon('bonappetit.com'),
      category: 'today',
    },
    {
      id: 'newsletter-1',
      title: 'Weekend Tech Digest',
      source: 'Morning Brew',
      url: '#',
      excerpt: 'AI developments, startup news, and product launches this week',
      ts: '8 min read',
      favicon: getFavicon('morningbrew.com'),
      category: 'today',
    },
    {
      id: 'podcast-1',
      title: 'The Future of Remote Work',
      source: 'Spotify',
      url: '#',
      excerpt: 'Deep dive into hybrid work models and distributed teams',
      ts: '45 min',
      favicon: getFavicon('spotify.com'),
      category: 'today',
    },
    {
      id: 'event-1',
      title: 'Local Farmers Market',
      source: 'Eventbrite',
      url: '#',
      excerpt: 'Saturday morning market with local vendors and live music',
      ts: 'Tomorrow 8 AM',
      favicon: getFavicon('eventbrite.com'),
      category: 'today',
    },
    {
      id: 'article-1',
      title: 'The Rise of Sustainable Tech',
      source: 'Wired',
      url: '#',
      excerpt: 'How technology companies are addressing climate change',
      ts: '12 min read',
      favicon: getFavicon('wired.com'),
      category: 'today',
    },
    {
      id: 'fitness-1',
      title: 'Morning Yoga Session',
      source: 'Apple Fitness+',
      url: '#',
      excerpt: '30-minute flow for flexibility and mindfulness',
      ts: '30 min',
      favicon: getFavicon('apple.com'),
      category: 'today',
    },
    {
      id: 'book-1',
      title: 'Digital Minimalism - Chapter 3',
      source: 'Kindle',
      url: '#',
      excerpt: 'Cal Newport on reclaiming focus in a noisy world',
      ts: '20 min left',
      favicon: getFavicon('amazon.com'),
      category: 'today',
    },
  ],
  patterns: [
    {
      id: 'weekend-coffee',
      title: 'Saturday Morning Coffee Ritual',
      source: 'Personal',
      url: '#',
      excerpt: 'Slow brewing process while catching up on weekend reading',
      ts: 'Saturdays 8 AM',
      favicon: '☕',
      category: 'patterns',
    },
    {
      id: 'weekend-walk',
      title: 'Nature Photography Walks',
      source: 'Personal',
      url: '#',
      excerpt: 'Exploring local trails with camera equipment',
      ts: 'Sunday mornings',
      favicon: '📸',
      category: 'patterns',
    },
    {
      id: 'cooking-session',
      title: 'Weekend Cooking Projects',
      source: 'Personal',
      url: '#',
      excerpt: 'Experimenting with new recipes and techniques',
      ts: 'Saturday afternoons',
      favicon: '👨‍🍳',
      category: 'patterns',
    },
    {
      id: 'tech-reading',
      title: 'Deep Tech Article Sessions',
      source: 'Various',
      url: '#',
      excerpt: 'Focused reading on emerging technologies and trends',
      ts: 'Sunday evenings',
      favicon: getFavicon('hackernews.com'),
      category: 'patterns',
    },
    {
      id: 'side-project',
      title: 'Personal Coding Projects',
      source: 'GitHub',
      url: '#',
      excerpt: 'Working on experimental apps and learning new frameworks',
      ts: 'Weekend mornings',
      favicon: getFavicon('github.com'),
      category: 'patterns',
    },
    {
      id: 'music-discovery',
      title: 'New Music Exploration',
      source: 'Spotify',
      url: '#',
      excerpt: 'Discovering artists and genres through algorithm recommendations',
      ts: 'Friday evenings',
      favicon: getFavicon('spotify.com'),
      category: 'patterns',
    },
    {
      id: 'documentary-night',
      title: 'Documentary Viewing',
      source: 'Netflix',
      url: '#',
      excerpt: 'Educational content on science, technology, and culture',
      ts: 'Saturday nights',
      favicon: getFavicon('netflix.com'),
      category: 'patterns',
    },
    {
      id: 'market-visit',
      title: 'Local Market Visits',
      source: 'Community',
      url: '#',
      excerpt: 'Supporting local businesses and discovering new products',
      ts: 'Saturday mornings',
      favicon: '🛒',
      category: 'patterns',
    },
  ],
  snippets: [
    {
      id: 'travel-1',
      title: 'Hidden Gems in Tokyo',
      source: 'Travel + Leisure',
      url: '#',
      excerpt: 'Off-the-beaten-path neighborhoods and local experiences',
      ts: '7 min read',
      favicon: getFavicon('travelandleisure.com'),
      category: 'snippets',
    },
    {
      id: 'photography-1',
      title: 'Street Photography Ethics Guide',
      source: 'PetaPixel',
      url: '#',
      excerpt: 'Respectful approaches to capturing candid moments in public spaces',
      ts: '5 min read',
      favicon: getFavicon('petapixel.com'),
      category: 'snippets',
    },
    {
      id: 'food-1',
      title: 'Fermentation Basics for Beginners',
      source: 'Serious Eats',
      url: '#',
      excerpt: 'Science behind kimchi, sourdough, and other fermented foods',
      ts: '10 min read',
      favicon: getFavicon('seriouseats.com'),
      category: 'snippets',
    },
    {
      id: 'mindfulness-1',
      title: 'Digital Detox Strategies That Actually Work',
      source: 'Harvard Health',
      url: '#',
      excerpt: 'Evidence-based approaches to reducing screen time mindfully',
      ts: '6 min read',
      favicon: getFavicon('health.harvard.edu'),
      category: 'snippets',
    },
    {
      id: 'creativity-1',
      title: 'The Science of Creative Breakthroughs',
      source: 'Scientific American',
      url: '#',
      excerpt: 'How constraints and boredom fuel innovative thinking',
      ts: '8 min read',
      favicon: getFavicon('scientificamerican.com'),
      category: 'snippets',
    },
    {
      id: 'sustainability-1',
      title: 'Zero Waste Kitchen Swaps',
      source: 'Treehugger',
      url: '#',
      excerpt: 'Simple changes to reduce food packaging and waste at home',
      ts: '4 min read',
      favicon: getFavicon('treehugger.com'),
      category: 'snippets',
    },
    {
      id: 'fitness-2',
      title: 'Bodyweight Exercises for Small Spaces',
      source: 'Nerd Fitness',
      url: '#',
      excerpt: 'Effective workouts that require minimal equipment and space',
      ts: '7 min read',
      favicon: getFavicon('nerdfitness.com'),
      category: 'snippets',
    },
    {
      id: 'psychology-1',
      title: 'The Psychology of Habit Formation',
      source: 'Psychology Today',
      url: '#',
      excerpt: 'Research-backed strategies for building lasting positive habits',
      ts: '9 min read',
      favicon: getFavicon('psychologytoday.com'),
      category: 'snippets',
    },
    {
      id: 'finance-1',
      title: 'Personal Finance for Freelancers',
      source: 'NerdWallet',
      url: '#',
      excerpt: 'Tax strategies and budgeting for irregular income streams',
      ts: '11 min read',
      favicon: getFavicon('nerdwallet.com'),
      category: 'snippets',
    },
    {
      id: 'astronomy-1',
      title: 'Beginner Guide to Astrophotography',
      source: 'Sky & Telescope',
      url: '#',
      excerpt: 'Equipment and techniques for capturing the night sky',
      ts: '12 min read',
      favicon: getFavicon('skyandtelescope.org'),
      category: 'snippets',
    },
    {
      id: 'gardening-1',
      title: 'Indoor Herb Garden Success Tips',
      source: 'Gardenista',
      url: '#',
      excerpt: 'Growing fresh herbs year-round in apartment settings',
      ts: '5 min read',
      favicon: getFavicon('gardenista.com'),
      category: 'snippets',
    },
    {
      id: 'language-1',
      title: 'Language Learning Through Media',
      source: 'FluentU',
      url: '#',
      excerpt: 'Using movies, podcasts, and music to improve fluency',
      ts: '6 min read',
      favicon: getFavicon('fluentu.com'),
      category: 'snippets',
    },
    {
      id: 'productivity-1',
      title: 'The Art of Slow Productivity',
      source: 'Cal Newport',
      url: '#',
      excerpt: 'Quality over quantity approach to meaningful work',
      ts: '8 min read',
      favicon: getFavicon('calnewport.com'),
      category: 'snippets',
    },
    {
      id: 'minimalism-1',
      title: 'Digital Minimalism in Practice',
      source: 'Becoming Minimalist',
      url: '#',
      excerpt: 'Practical steps to declutter your digital life',
      ts: '7 min read',
      favicon: getFavicon('becomingminimalist.com'),
      category: 'snippets',
    },
    {
      id: 'relationships-1',
      title: 'Building Deeper Friendships as Adults',
      source: 'The Atlantic',
      url: '#',
      excerpt: 'Overcoming barriers to meaningful connections in busy life',
      ts: '10 min read',
      favicon: getFavicon('theatlantic.com'),
      category: 'snippets',
    },
    {
      id: 'meditation-1',
      title: 'Meditation Without the Mysticism',
      source: 'Headspace',
      url: '#',
      excerpt: 'Science-based approach to mindfulness and stress reduction',
      ts: '6 min read',
      favicon: getFavicon('headspace.com'),
      category: 'snippets',
    },
  ],
};

// Time-aware data processing functions
export const getTimeAwarePriority = (snippet: SnippetData): number => {
  const baseScore = snippet.priority === 'high' ? 10 : snippet.priority === 'medium' ? 5 : 1;
  const timeSlot = getCurrentTimeSlot();
  const urgencyBonus = snippet.intelligence?.source_type ?
    getUrgencyScore(timeSlot, snippet.intelligence.source_type) : 0;

  // Time decay - older items get lower priority
  const tsText = snippet.ts;
  let ageBonus = 0;
  if (tsText.includes('min ago')) ageBonus = 3;
  else if (tsText.includes('hour') || tsText.includes('h ago')) ageBonus = 2;
  else if (tsText.includes('Yesterday') || tsText.includes('days ago')) ageBonus = -1;

  return baseScore + urgencyBonus + ageBonus;
};

export const sortByTimeAwarePriority = (items: SnippetData[]): SnippetData[] => {
  return [...items].sort((a, b) => getTimeAwarePriority(b) - getTimeAwarePriority(a));
};

// Export time-aware data
export const getTimeAwareWorkdayData = (): Record<string, SnippetData[]> => ({
  today: sortByTimeAwarePriority(workdayData.today),
  patterns: workdayData.patterns,
  snippets: workdayData.snippets
});

export const getTimeAwareWeekendData = (): Record<string, SnippetData[]> => ({
  today: sortByTimeAwarePriority(weekendData.today),
  patterns: weekendData.patterns,
  snippets: weekendData.snippets
});