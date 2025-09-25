import { useState, useEffect } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Clock, Check, Search } from 'lucide-react';
import { usePrefsStore } from '@/store/prefsStore';
import { workdayData, weekendData, SnippetData } from '@/data/seeds';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const { dayMode, profile } = usePrefsStore();

  const currentData = dayMode === 'workday' ? workdayData : weekendData;
  const allSnippets = [
    ...currentData.today,
    ...currentData.patterns,
    ...currentData.snippets,
  ];

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleAction = (snippet: SnippetData, action: string) => {
    console.log(`${action} action for:`, snippet.title);
    setOpen(false);
  };

  return (
    <>
      {/* Trigger hint for power users */}
      {profile === 'power' && (
        <div className="fixed bottom-4 right-4 z-50">
          <Badge variant="outline" className="kbd-hint animate-fade-in">
            <Search className="w-3 h-3 mr-1" />
            ⌘K to search
          </Badge>
        </div>
      )}

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search snippets and actions..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          <CommandGroup heading="Today">
            {currentData.today.slice(0, 4).map((snippet) => (
              <CommandItem
                key={snippet.id}
                onSelect={() => handleAction(snippet, 'open')}
                className="flex items-center gap-3 p-3"
              >
                <img 
                  src={snippet.favicon.startsWith('http') ? snippet.favicon : ''} 
                  alt=""
                  className="w-4 h-4 rounded-sm"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{snippet.title}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {snippet.source} • {snippet.ts}
                  </div>
                </div>
                <div className="flex gap-1">
                  {profile === 'power' && (
                    <>
                      <Badge variant="secondary" className="kbd-hint text-xs">↵</Badge>
                      <Badge variant="secondary" className="kbd-hint text-xs">R</Badge>
                      <Badge variant="secondary" className="kbd-hint text-xs">D</Badge>
                    </>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Patterns">
            {currentData.patterns.slice(0, 3).map((snippet) => (
              <CommandItem
                key={snippet.id}
                onSelect={() => handleAction(snippet, 'open')}
                className="flex items-center gap-3 p-3"
              >
                <img 
                  src={snippet.favicon.startsWith('http') ? snippet.favicon : ''} 
                  alt=""
                  className="w-4 h-4 rounded-sm"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{snippet.title}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {snippet.source} • {snippet.ts}
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Snippets">
            {currentData.snippets.slice(0, 6).map((snippet) => (
              <CommandItem
                key={snippet.id}
                onSelect={() => handleAction(snippet, 'open')}
                className="flex items-center gap-3 p-3"
              >
                <img 
                  src={snippet.favicon.startsWith('http') ? snippet.favicon : ''} 
                  alt=""
                  className="w-4 h-4 rounded-sm"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{snippet.title}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {snippet.source} • {snippet.ts}
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => setOpen(false)}>
              <ExternalLink className="w-4 h-4 mr-2" />
              <span>Open selected item</span>
              {profile === 'power' && (
                <Badge variant="secondary" className="kbd-hint ml-auto text-xs">↵</Badge>
              )}
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              <Clock className="w-4 h-4 mr-2" />
              <span>Remind in 2 hours</span>
              {profile === 'power' && (
                <Badge variant="secondary" className="kbd-hint ml-auto text-xs">R</Badge>
              )}
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              <Check className="w-4 h-4 mr-2" />
              <span>Mark as done</span>
              {profile === 'power' && (
                <Badge variant="secondary" className="kbd-hint ml-auto text-xs">D</Badge>
              )}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}