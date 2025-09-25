import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type ImageType = 'nature' | 'abstract' | 'minimal';

const peacefulImages = {
  nature: [
    { id: 1, emoji: '🌊', gradient: 'from-blue-400 to-blue-600', text: 'Ocean waves' },
    { id: 2, emoji: '🌸', gradient: 'from-pink-300 to-pink-500', text: 'Cherry blossoms' },
    { id: 3, emoji: '🍃', gradient: 'from-green-300 to-green-500', text: 'Gentle breeze' },
    { id: 4, emoji: '🌅', gradient: 'from-orange-300 to-pink-400', text: 'Sunrise' },
  ],
  abstract: [
    { id: 5, emoji: '✨', gradient: 'from-purple-300 to-blue-400', text: 'Floating particles' },
    { id: 6, emoji: '🎋', gradient: 'from-teal-300 to-green-400', text: 'Bamboo zen' },
    { id: 7, emoji: '💫', gradient: 'from-indigo-300 to-purple-400', text: 'Cosmic calm' },
  ],
  minimal: [
    { id: 8, emoji: '', gradient: 'from-gray-100 to-gray-200', text: 'Peaceful void' },
    { id: 9, emoji: '○', gradient: 'from-slate-200 to-slate-300', text: 'Simple circle' },
  ]
};

interface Props {
  type?: ImageType;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function PeacefulSpace({ type = 'nature', size = 'medium', className }: Props) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const images = peacefulImages[type];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
        setIsVisible(true);
      }, 500);
    }, 8000); // Change every 8 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  const image = images[currentImage];

  const getSizeClasses = () => {
    switch (size) {
      case 'small': return 'h-24';
      case 'medium': return 'h-32';
      case 'large': return 'h-48';
    }
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-1000 hover:scale-105",
      getSizeClasses(),
      className
    )}>
      <div className={cn(
        "w-full h-full bg-gradient-to-br flex flex-col items-center justify-center relative transition-all duration-500",
        image.gradient,
        isVisible ? 'opacity-100' : 'opacity-70'
      )}>
        {image.emoji && (
          <div className={cn(
            "text-6xl mb-2 transition-all duration-500",
            size === 'small' && "text-4xl mb-1",
            size === 'large' && "text-8xl mb-4",
            isVisible ? 'scale-100' : 'scale-95'
          )}>
            {image.emoji}
          </div>
        )}

        <div className={cn(
          "text-white/80 text-xs font-medium text-center px-2 transition-all duration-500",
          size === 'large' && "text-sm",
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
        )}>
          {image.text}
        </div>

        {/* Subtle animation overlay */}
        <div className="absolute inset-0 bg-white/5 animate-pulse" style={{
          animationDuration: '4s',
          animationDelay: `${currentImage * 1000}ms`
        }} />
      </div>
    </Card>
  );
}