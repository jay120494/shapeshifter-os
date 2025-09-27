import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, Gamepad2, Coffee, Target, Trophy, Star, Clock } from 'lucide-react';
import { usePrefsStore } from '@/store/prefsStore';
import { cn } from '@/lib/utils';

export function PersonaWidget() {
  const { profile, incLychees } = usePrefsStore();
  const [gameProgress, setGameProgress] = useState(65);
  const [gamesPlayed, setGamesPlayed] = useState(3);

  const playGame = () => {
    setGamesPlayed(prev => prev + 1);
    setGameProgress(prev => Math.min(100, prev + 15));
    incLychees(2);
  };

  if (profile === 'senior') {
    return (
      <Card className="card-gradient">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              <h3 className="font-semibold text-lg">Hearts Game</h3>
            </div>
            <Badge variant="outline" className="text-green-600">
              Relaxing
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="text-center p-4 rounded-lg bg-muted/20">
              <div className="text-2xl mb-2">♠️ ♥️ ♦️ ♣️</div>
              <p className="text-sm text-muted-foreground">
                Take a mental break with a quick game of Hearts
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 rounded-lg bg-background/50 border">
                <div className="text-lg font-bold text-blue-600">{gamesPlayed}</div>
                <div className="text-xs text-muted-foreground">Games today</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-background/50 border">
                <div className="text-lg font-bold text-purple-600">12m</div>
                <div className="text-xs text-muted-foreground">Break time</div>
              </div>
            </div>

            <Button
              onClick={playGame}
              className="w-full"
              variant="outline"
            >
              <Heart className="w-4 h-4 mr-2" />
              Quick Game
              <Badge variant="secondary" className="ml-2">+2</Badge>
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (profile === 'power') {
    return (
      <Card className="card-gradient">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" />
              <h3 className="font-semibold">Game Hub</h3>
            </div>
            <Badge variant="outline" className="text-purple-600">
              Power Mode
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-950/30 dark:to-blue-950/30 border">
              <div className="w-8 h-8 rounded bg-purple-500 flex items-center justify-center text-white text-xs font-bold">
                FN
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">Fortnite</div>
                <div className="text-xs text-muted-foreground">Season rewards available</div>
              </div>
              <Badge variant="secondary" className="text-xs">Live</Badge>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 rounded bg-background/50 border">
                <div className="font-bold text-green-500">#47</div>
                <div className="text-muted-foreground">Rank</div>
              </div>
              <div className="text-center p-2 rounded bg-background/50 border">
                <div className="font-bold text-blue-500">2.1K</div>
                <div className="text-muted-foreground">XP</div>
              </div>
              <div className="text-center p-2 rounded bg-background/50 border">
                <div className="font-bold text-purple-500">7</div>
                <div className="text-muted-foreground">Squad</div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Battle Pass Progress</span>
                <span className="text-purple-500">{gameProgress}%</span>
              </div>
              <Progress value={gameProgress} className="h-1.5" />
            </div>

            <Button
              onClick={playGame}
              size="sm"
              className="w-full hero-gradient"
            >
              <Gamepad2 className="w-3 h-3 mr-1" />
              Quick Match
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Default/Casual profile
  return (
    <Card className="card-gradient">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <h3 className="font-semibold">Mini Games</h3>
          </div>
          <Badge variant="outline" className="text-yellow-600">
            Casual
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border">
            <div className="text-2xl">💣</div>
            <div className="flex-1">
              <div className="text-sm font-medium">Minesweeper</div>
              <div className="text-xs text-muted-foreground">Clear the field safely</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-2 rounded bg-background/50 border">
              <div className="text-lg font-bold text-green-500">{gamesPlayed}</div>
              <div className="text-xs text-muted-foreground">Cleared</div>
            </div>
            <div className="text-center p-2 rounded bg-background/50 border">
              <div className="text-lg font-bold text-blue-500">1:47</div>
              <div className="text-xs text-muted-foreground">Best time</div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Daily Progress</span>
              <span className="text-yellow-500">{gameProgress}%</span>
            </div>
            <Progress value={gameProgress} className="h-2" />
          </div>

          <Button
            onClick={playGame}
            className="w-full"
            variant="outline"
          >
            <Trophy className="w-4 h-4 mr-2" />
            New Game
            <Badge variant="secondary" className="ml-2">+2</Badge>
          </Button>
        </div>
      </div>
    </Card>
  );
}