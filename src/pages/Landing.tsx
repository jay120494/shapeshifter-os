import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/layout/Container';
import { 
  ArrowRight, 
  Calendar, 
  Target, 
  BookOpen, 
  Shield, 
  Zap,
  Settings,
  Users,
  Laptop
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <Container className="py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 animate-fade-in">
              ✨ Personal Web OS - Early Access
            </Badge>
            
            <h1 className="text-hero font-bold tracking-tight mb-6 hero-gradient bg-clip-text text-transparent animate-fade-in">
              Fewer tabs. Faster starts. Calmer days.
            </h1>
            
            <p className="text-subtitle text-muted-foreground mb-8 animate-fade-in">
              Your personal, adaptive start screen for the web. 
              Organize your digital life into three simple columns: Today, Patterns, and Snippets.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
              <Button asChild size="lg" className="hero-gradient text-lg px-8 py-6 tap-target">
                <Link to="/demo">
                  Launch Demo
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 tap-target">
                Watch 90 sec reel
              </Button>
            </div>

            {/* Visual Demo */}
            <div className="mt-16 relative">
              <div className="absolute inset-0 bg-gradient-hero opacity-10 blur-3xl rounded-full"></div>
              <Card className="card-gradient interactive relative">
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Today Preview */}
                    <div className="space-y-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        Today
                      </h3>
                      <div className="space-y-2">
                        {['Team standup in 15 min', 'PR review required', 'Design feedback'].map((item, i) => (
                          <div key={i} className="p-2 bg-muted/50 rounded text-sm">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Patterns Preview */}
                    <div className="space-y-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Target className="w-4 h-4 text-green-500" />
                        Patterns
                      </h3>
                      <div className="space-y-2">
                        {['GitHub PR Reviews', 'Team Check-ins', 'Documentation'].map((item, i) => (
                          <div key={i} className="p-2 bg-muted/50 rounded text-sm">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Snippets Preview */}
                    <div className="space-y-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-purple-500" />
                        Snippets
                      </h3>
                      <div className="space-y-2">
                        {['React optimization', 'TypeScript guide', 'CSS architecture'].map((item, i) => (
                          <div key={i} className="p-2 bg-muted/50 rounded text-sm">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* Value Cards */}
      <section className="py-20 bg-muted/30">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-gradient interactive text-center p-8">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Today</h3>
              <p className="text-muted-foreground">
                The 10 things that matter most right now. No endless scrolling, just focus on what needs your attention today.
              </p>
            </Card>

            <Card className="card-gradient interactive text-center p-8">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Patterns</h3>
              <p className="text-muted-foreground">
                What you return to regularly. Your habits, routines, and recurring tasks organized intelligently.
              </p>
            </Card>

            <Card className="card-gradient interactive text-center p-8">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Snippets</h3>
              <p className="text-muted-foreground">
                Act without opening 10 tabs. Quick insights and actions that keep you moving forward.
              </p>
            </Card>
          </div>
        </Container>
      </section>

      {/* Profiles Section */}
      <section className="py-20">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Adapts to How You Work</h2>
            <p className="text-xl text-muted-foreground">
              Three profiles that reshape the interface for different needs and preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-gradient interactive p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold">Senior Mode</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Larger text, higher contrast, reduced motion, and 44×44 tap targets for accessibility.
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• 1.2x text scaling</li>
                <li>• High contrast colors</li>
                <li>• Motion reduced</li>
                <li>• Max 6 items per section</li>
              </ul>
            </Card>

            <Card className="card-gradient interactive p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold">Default Mode</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Balanced interface designed for most users with standard sizing and interactions.
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Standard scaling</li>
                <li>• Balanced contrast</li>
                <li>• Smooth animations</li>
                <li>• Optimal information density</li>
              </ul>
            </Card>

            <Card className="card-gradient interactive p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Laptop className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold">Power Mode</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Compact density with keyboard shortcuts and advanced interactions for power users.
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• 0.9x compact scaling</li>
                <li>• Keyboard hint badges</li>
                <li>• Dense information layout</li>
                <li>• Advanced shortcuts</li>
              </ul>
            </Card>
          </div>
        </Container>
      </section>

      {/* Privacy & Features */}
      <section className="py-20 bg-muted/30">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Private by Default</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Local Index</h3>
                    <p className="text-muted-foreground">All data stays on your device. No cloud syncing unless you opt in.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Opt-in Connectors</h3>
                    <p className="text-muted-foreground">Connect only the services you want, when you want them.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">One-click Wipe</h3>
                    <p className="text-muted-foreground">Clear all data instantly whenever you need a fresh start.</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="card-gradient p-8">
              <h3 className="text-xl font-semibold mb-4">Phase 2: Shapeshifter Assist</h3>
              <p className="text-muted-foreground mb-6">
                Coming soon - AI that adapts forms and interfaces to your needs without touching sensitive data.
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                  <span className="text-sm">Complex forms</span>
                  <span className="text-xs text-green-600">Simplified</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                  <span className="text-sm">Tiny targets</span>
                  <span className="text-xs text-blue-600">Enlarged</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                  <span className="text-sm">Poor contrast</span>
                  <span className="text-xs text-purple-600">Enhanced</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                * We never touch passwords or payment fields
              </p>
            </Card>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready for a Calmer Web?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join the early access program and help shape the future of personal web interfaces.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="hero-gradient text-lg px-8 py-6">
                <Link to="/demo">Try the Demo</Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Request Early Access
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}