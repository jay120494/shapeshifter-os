import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Command, Search, ArrowDown, ArrowUp, CornerDownLeft, X } from 'lucide-react';

interface KeyboardHelpProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const shortcuts = [
  {
    category: 'Navigation',
    items: [
      { keys: ['⌘', 'K'], description: 'Open command palette', icon: Search },
      { keys: ['J'], description: 'Next item', icon: ArrowDown },
      { keys: ['K'], description: 'Previous item', icon: ArrowUp },
      { keys: ['?'], description: 'Show this help', icon: null },
    ]
  },
  {
    category: 'Actions',
    items: [
      { keys: ['Enter'], description: 'Open selected item', icon: CornerDownLeft },
      { keys: ['D'], description: 'Mark as done', icon: null },
      { keys: ['P'], description: 'Pin item', icon: null },
      { keys: ['R'], description: 'Remind in 2h', icon: null },
    ]
  },
  {
    category: 'Quick Actions',
    items: [
      { keys: ['G', 'H'], description: 'Go to home', icon: null },
      { keys: ['G', 'D'], description: 'Go to demo', icon: null },
      { keys: ['Esc'], description: 'Close dialog/cancel', icon: X },
      { keys: ['⌘', 'Shift', 'P'], description: 'Toggle profile', icon: null },
    ]
  }
];

export function KeyboardHelp({ open, onOpenChange }: KeyboardHelpProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Command className="w-5 h-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {shortcuts.map((section) => (
            <div key={section.category}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                {section.category}
              </h3>
              <div className="space-y-2">
                {section.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      {item.icon && <item.icon className="w-4 h-4 text-muted-foreground" />}
                      <span className="text-sm">{item.description}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {item.keys.map((key, keyIndex) => (
                        <Badge key={keyIndex} variant="outline" className="font-mono text-xs px-2 py-1">
                          {key}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {section.category !== 'Quick Actions' && <Separator className="mt-4" />}
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Command className="w-4 h-4" />
            <span>Pro tip: These shortcuts work globally throughout the interface</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}