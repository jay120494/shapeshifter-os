import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  delay: number;
}

interface ConfettiEffectProps {
  active: boolean;
  onComplete?: () => void;
  intensity?: 'low' | 'medium' | 'high';
}

const colors = [
  'hsl(45, 93%, 47%)',   // Gold
  'hsl(142, 76%, 36%)',  // Green
  'hsl(221, 83%, 53%)',  // Blue
  'hsl(262, 83%, 58%)',  // Purple
  'hsl(300, 70%, 60%)',  // Pink
  'hsl(0, 84%, 60%)',    // Red
];

export function ConfettiEffect({ active, onComplete, intensity = 'medium' }: ConfettiEffectProps) {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);

  const particleCount = intensity === 'low' ? 8 : intensity === 'medium' ? 15 : 25;

  useEffect(() => {
    if (active) {
      const newParticles: ConfettiParticle[] = [];
      
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 4,
          delay: Math.random() * 200,
        });
      }
      
      setParticles(newParticles);
      
      // Clean up after animation completes
      setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 1000);
    }
  }, [active, particleCount, onComplete]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute confetti-particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            width: particle.size,
            height: particle.size,
            borderRadius: '50%',
            animationDelay: `${particle.delay}ms`,
          }}
        />
      ))}
    </div>
  );
}