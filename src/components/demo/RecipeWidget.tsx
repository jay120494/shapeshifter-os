import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UtensilsCrossed, Flame, Timer } from 'lucide-react';

const recipes = [
  {
    id: 'bao',
    title: 'Midday Bao Bites',
    subtitle: 'Steamed char siu buns with crunchy pickles',
    duration: '20 min',
    calories: '320 cal',
    skill: 'Beginner'
  },
  {
    id: 'tea',
    title: 'Oolong Tea Flight',
    subtitle: 'Honey orchid, milk, and roasted oolong pairings',
    duration: '12 min',
    calories: '0 cal',
    skill: 'Tea Master'
  },
  {
    id: 'noodles',
    title: 'Focus-Friendly Dan Dan',
    subtitle: 'Chilled sesame noodles with crisp vegetables',
    duration: '18 min',
    calories: '410 cal',
    skill: 'Intermediate'
  }
];

export function RecipeWidget() {
  return (
    <Card className="card-gradient p-4 rounded-2xl space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4 text-amber-600" />
            Lychee Lab Kitchen
          </h3>
          <p className="text-sm text-muted-foreground">
            Nourish your workflow with mindful bites inspired by bao carts and tea houses.
          </p>
        </div>
        <Badge variant="secondary" className="gap-1">
          <Flame className="w-3 h-3" /> Seasonal
        </Badge>
      </div>

      <div className="space-y-3">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="rounded-xl border bg-background/70 p-3 flex items-center gap-4 hover:bg-muted/60 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-gradient-achievement text-white text-sm font-semibold flex items-center justify-center">
              {recipe.duration}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{recipe.title}</p>
              <p className="text-xs text-muted-foreground truncate">{recipe.subtitle}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <Timer className="w-3 h-3" />
                  {recipe.duration}
                </span>
                <span>{recipe.calories}</span>
                <span>{recipe.skill}</span>
              </div>
            </div>
            <Button size="sm" variant="outline" className="text-xs">
              Cook
            </Button>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-dashed bg-background/80 p-3 text-sm">
        Pair your tasks with snacks: finish a sprint, earn a fortune cookie, unlock a new bao filling.
      </div>
    </Card>
  );
}
