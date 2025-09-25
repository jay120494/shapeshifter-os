import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw, Search } from 'lucide-react';
import { usePrefsStore } from '@/store/prefsStore';
import { cn } from '@/lib/utils';

export function ZoomSlider() {
  const { profile, zoomLevel, setZoomLevel } = usePrefsStore();
  const [isOpen, setIsOpen] = useState(false);

  if (profile !== 'senior') return null;

  const handleZoomChange = (value: number[]) => {
    setZoomLevel(value[0]);
  };

  const resetZoom = () => setZoomLevel(1.5);
  const zoomIn = () => setZoomLevel(Math.min(3.0, zoomLevel + 0.5));
  const zoomOut = () => setZoomLevel(Math.max(1.0, zoomLevel - 0.5));

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Zoom Control Button */}
      <div
        className="relative"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {/* Main Zoom Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 bg-background/90 backdrop-blur-sm border rounded-lg shadow-lg flex items-center justify-center hover:bg-muted transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Zoom Controls Panel */}
        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 bg-background/95 backdrop-blur-sm border rounded-lg p-4 shadow-xl space-y-4 min-w-[220px]">
            <div className="text-sm font-medium text-center">
              Text Size: {zoomLevel}x
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={zoomOut}
                disabled={zoomLevel <= 1.0}
                className="p-2 flex-shrink-0"
              >
                <ZoomOut className="w-3 h-3" />
              </Button>

              <Slider
                value={[zoomLevel]}
                onValueChange={handleZoomChange}
                min={1.0}
                max={3.0}
                step={0.5}
                className="flex-1"
              />

              <Button
                variant="outline"
                size="sm"
                onClick={zoomIn}
                disabled={zoomLevel >= 3.0}
                className="p-2 flex-shrink-0"
              >
                <ZoomIn className="w-3 h-3" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetZoom}
                className="flex-1 text-xs"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset
              </Button>
            </div>

            <div className="text-xs text-muted-foreground text-center">
              Adjust for comfortable reading
            </div>
          </div>
        )}
      </div>
    </div>
  );
}