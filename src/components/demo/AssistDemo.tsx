import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Wand2, HelpCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePrefsStore } from '@/store/prefsStore';

export function AssistDemo() {
  const [assistEnabled, setAssistEnabled] = useState(false);
  const [currentField, setCurrentField] = useState(0);
  const { profile } = usePrefsStore();

  const fields = [
    { id: 'name', label: 'Full Name', type: 'text', required: true },
    { id: 'email', label: 'Email Address', type: 'email', required: true },
    { id: 'address', label: 'Street Address', type: 'text', required: false },
    { id: 'date', label: 'Date of Birth', type: 'date', required: false },
    { id: 'category', label: 'Category', type: 'select', required: true },
    { id: 'notes', label: 'Additional Notes', type: 'textarea', required: false },
  ];

  const handleAssistToggle = () => {
    setAssistEnabled(!assistEnabled);
    if (!assistEnabled) {
      setCurrentField(0);
      // Scroll to first field
      setTimeout(() => {
        document.getElementById('assist-form')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const nextField = () => {
    if (currentField < fields.length - 1) {
      setCurrentField(currentField + 1);
    }
  };

  const getFieldSize = () => {
    if (assistEnabled) {
      return profile === 'senior' ? 'h-14' : 'h-12';
    }
    return profile === 'senior' ? 'h-12' : 'h-10';
  };

  return (
    <div className="space-y-6">
      {/* Demo Header */}
      <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Wand2 className="w-6 h-6 text-amber-600" />
              Bao Assist Demo
            </CardTitle>
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
              Phase 2 Preview
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Experience how AI can adapt interfaces for better accessibility and usability
          </p>
        </CardHeader>
      </Card>

      {/* Control Panel */}
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-4">
          <Button
            onClick={handleAssistToggle}
            variant={assistEnabled ? "default" : "outline"}
            className={cn(
              "gap-2 transition-all duration-300",
              assistEnabled && "bg-gradient-achievement hover:opacity-90"
            )}
          >
            {assistEnabled ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {assistEnabled ? 'Disable Assist' : 'Enable Assist'}
          </Button>
          
          {assistEnabled && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Field {currentField + 1} of {fields.length}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={nextField}
                disabled={currentField >= fields.length - 1}
                className="gap-1"
              >
                Next <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                <HelpCircle className="w-4 h-4" />
                Guardrails
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>We never touch passwords or payment fields. Smart AI respects privacy boundaries.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Form Demo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card className={cn(
            "transition-all duration-500",
            assistEnabled && "ring-2 ring-primary/50 shadow-lg"
          )}>
            <CardHeader>
              <CardTitle>Complex Registration Form</CardTitle>
            </CardHeader>
            <CardContent id="assist-form" className="space-y-6">
              {fields.map((field, index) => {
                const isActive = assistEnabled && currentField === index;
                const isCompleted = assistEnabled && currentField > index;
                
                return (
                  <div 
                    key={field.id}
                    className={cn(
                      "space-y-2 transition-all duration-300",
                      isActive && "ring-2 ring-primary rounded-lg p-4 bg-primary/5",
                      assistEnabled && !isActive && "opacity-60"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {assistEnabled && (
                        <span className={cn(
                          "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold",
                          isCompleted ? "bg-green-500 text-white" :
                          isActive ? "bg-primary text-primary-foreground" :
                          "bg-muted text-muted-foreground"
                        )}>
                          {isCompleted ? '✓' : index + 1}
                        </span>
                      )}
                      <Label 
                        htmlFor={field.id}
                        className={cn(
                          "transition-all duration-300",
                          isActive && "font-semibold text-primary",
                          assistEnabled && profile === 'senior' && "text-lg"
                        )}
                      >
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                    </div>
                    
                    {field.type === 'select' ? (
                      <Select>
                        <SelectTrigger className={cn(
                          "transition-all duration-300",
                          getFieldSize(),
                          isActive && "ring-2 ring-primary/50"
                        )}>
                          <SelectValue placeholder="Select a category..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="personal">Personal</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : field.type === 'textarea' ? (
                      <Textarea
                        id={field.id}
                        placeholder={`Enter your ${field.label.toLowerCase()}...`}
                        className={cn(
                          "transition-all duration-300 resize-none",
                          isActive && "ring-2 ring-primary/50 min-h-[100px]",
                          !isActive && assistEnabled && "min-h-[40px]"
                        )}
                      />
                    ) : (
                      <Input
                        id={field.id}
                        type={field.type}
                        placeholder={`Enter your ${field.label.toLowerCase()}...`}
                        className={cn(
                          "transition-all duration-300",
                          getFieldSize(),
                          isActive && "ring-2 ring-primary/50"
                        )}
                      />
                    )}
                  </div>
                );
              })}
              
              <Button 
                className={cn(
                  "w-full transition-all duration-300",
                  assistEnabled && (profile === 'senior' ? "h-14 text-lg" : "h-12")
                )}
                disabled={!assistEnabled}
              >
                Submit Registration
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Simulated Distractions */}
        <div className="space-y-4">
          <Card className={cn(
            "transition-all duration-300",
            assistEnabled && "opacity-30 blur-sm"
          )}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Recent Updates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xs text-muted-foreground">
                • 5 new notifications
              </div>
              <div className="text-xs text-muted-foreground">
                • Email from Sarah Wilson
              </div>
              <div className="text-xs text-muted-foreground">
                • Calendar reminder: Team standup
              </div>
            </CardContent>
          </Card>

          <Card className={cn(
            "transition-all duration-300",
            assistEnabled && "opacity-30 blur-sm"
          )}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full text-xs" disabled={assistEnabled}>
                Create New Project
              </Button>
              <Button variant="outline" size="sm" className="w-full text-xs" disabled={assistEnabled}>
                Schedule Meeting
              </Button>
            </CardContent>
          </Card>

          {assistEnabled && (
            <Card className="border-green-200 bg-green-50 animate-fade-in">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-green-800 flex items-center gap-2">
                  <Wand2 className="w-4 h-4" />
                  Assist Active
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-xs text-green-700">
                  ✓ Enhanced contrast
                </div>
                <div className="text-xs text-green-700">
                  ✓ Larger tap targets
                </div>
                <div className="text-xs text-green-700">
                  ✓ Guided workflow
                </div>
                <div className="text-xs text-green-700">
                  ✓ Distraction reduction
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}