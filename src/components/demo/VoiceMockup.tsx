import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePrefsStore } from '@/store/prefsStore';

const voiceCommands = [
  "Hide social media until 6pm",
  "Remind me about the PR in 30 minutes",
  "Move YouTube to evening slot",
  "Show only urgent items",
  "Switch to focus mode",
  "Archive all newsletters"
];

export function VoiceMockup() {
  const { profile, dayMode } = usePrefsStore();
  const [isListening, setIsListening] = useState(false);
  const [currentCommand, setCurrentCommand] = useState('');
  const [showCommands, setShowCommands] = useState(false);

  // Simulate voice interaction
  const simulateVoice = () => {
    if (isListening) {
      setIsListening(false);
      setCurrentCommand('');
      return;
    }

    setIsListening(true);

    // After 2 seconds, show a random command
    setTimeout(() => {
      const randomCommand = voiceCommands[Math.floor(Math.random() * voiceCommands.length)];
      setCurrentCommand(randomCommand);

      // After another 1.5 seconds, "process" the command
      setTimeout(() => {
        setIsListening(false);
        setTimeout(() => setCurrentCommand(''), 2000);
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed bottom-20 right-4 z-40">
      {/* Voice Button */}
      <div className="relative">
        <Button
          onClick={simulateVoice}
          className={cn(
            "w-14 h-14 rounded-full shadow-lg transition-all duration-300",
            isListening ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600",
            "border-4 border-white"
          )}
        >
          {isListening ? (
            <MicOff className="w-6 h-6 text-white animate-pulse" />
          ) : (
            <Mic className="w-6 h-6 text-white" />
          )}
        </Button>

        {/* Listening Animation */}
        {isListening && (
          <div className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping" />
        )}

        {/* Command Display */}
        {currentCommand && (
          <div className="absolute bottom-full right-0 mb-2 bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-xl max-w-xs">
            <div className="flex items-start gap-2">
              <Volume2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium">{currentCommand}</div>
                <div className="text-xs text-green-600 mt-1">✓ Processing...</div>
              </div>
            </div>
          </div>
        )}

        {/* Sample Commands Tooltip */}
        {showCommands && (
          <div className="absolute bottom-full right-0 mb-2 bg-background/95 backdrop-blur-sm border rounded-lg p-4 shadow-xl min-w-[280px]">
            <div className="text-sm font-medium mb-2">Try saying:</div>
            <div className="space-y-1">
              {voiceCommands.slice(0, 4).map((command, index) => (
                <div key={index} className="text-xs text-muted-foreground flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-blue-500" />
                  "{command}"
                </div>
              ))}
            </div>
            <Badge variant="secondary" className="text-xs mt-2">
              Coming Soon
            </Badge>
          </div>
        )}
      </div>

      {/* Help Text */}
      {!isListening && !currentCommand && (
        <div
          className="absolute bottom-full right-0 mb-2 text-right cursor-pointer"
          onMouseEnter={() => setShowCommands(true)}
          onMouseLeave={() => setShowCommands(false)}
        >
          <div className="text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded border">
            Voice Control
          </div>
        </div>
      )}
    </div>
  );
}