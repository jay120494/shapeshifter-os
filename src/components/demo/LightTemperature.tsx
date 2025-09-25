import { useEffect, useState } from 'react';
import { usePrefsStore } from '@/store/prefsStore';

export function LightTemperature() {
  const { isFeatureActive } = usePrefsStore();
  const [currentTemp, setCurrentTemp] = useState(6500); // Default daylight temperature

  useEffect(() => {
    if (!isFeatureActive('light-temperature')) return;

    const updateTemperature = () => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const timeInMinutes = hour * 60 + minute;

      // Temperature schedule:
      // 6 AM (360 min): 6500K (bright daylight)
      // 12 PM (720 min): 6500K (noon)
      // 6 PM (1080 min): 4500K (warmer)
      // 10 PM (1320 min): 3000K (warm/yellow)
      // 12 AM (0/1440 min): 2700K (very warm)

      let temperature;

      if (timeInMinutes >= 360 && timeInMinutes <= 720) {
        // Morning to noon: stay bright
        temperature = 6500;
      } else if (timeInMinutes > 720 && timeInMinutes <= 1080) {
        // Afternoon: gradually warm up
        const progress = (timeInMinutes - 720) / (1080 - 720);
        temperature = 6500 - (2000 * progress); // 6500K to 4500K
      } else if (timeInMinutes > 1080 && timeInMinutes <= 1320) {
        // Evening: get warmer
        const progress = (timeInMinutes - 1080) / (1320 - 1080);
        temperature = 4500 - (1500 * progress); // 4500K to 3000K
      } else {
        // Night time: very warm
        if (timeInMinutes > 1320 || timeInMinutes < 360) {
          temperature = 2700; // Very warm for late night/early morning
        }
      }

      setCurrentTemp(Math.round(temperature || 2700));
    };

    // Update immediately
    updateTemperature();

    // Update every minute
    const interval = setInterval(updateTemperature, 60000);

    return () => clearInterval(interval);
  }, [isFeatureActive]);

  useEffect(() => {
    if (!isFeatureActive('light-temperature')) {
      // Remove any temperature filters
      document.documentElement.style.removeProperty('--light-temperature-filter');
      document.documentElement.style.removeProperty('--light-temperature-overlay');
      return;
    }

    // Apply temperature filter
    const getTemperatureFilter = (temp: number) => {
      if (temp >= 6000) {
        // Cool/daylight: slightly blue tint
        return 'sepia(0%) saturate(100%) hue-rotate(0deg) brightness(1.02) contrast(1.01)';
      } else if (temp >= 5000) {
        // Neutral
        return 'sepia(5%) saturate(95%) hue-rotate(-5deg) brightness(1) contrast(1)';
      } else if (temp >= 4000) {
        // Slightly warm
        return 'sepia(10%) saturate(90%) hue-rotate(-10deg) brightness(0.98) contrast(0.99)';
      } else if (temp >= 3000) {
        // Warm
        return 'sepia(20%) saturate(85%) hue-rotate(-20deg) brightness(0.95) contrast(0.97)';
      } else {
        // Very warm/night mode
        return 'sepia(30%) saturate(80%) hue-rotate(-30deg) brightness(0.9) contrast(0.95)';
      }
    };

    const getOverlayColor = (temp: number) => {
      if (temp >= 6000) {
        return 'rgba(173, 216, 255, 0.03)'; // Slight cool blue
      } else if (temp >= 5000) {
        return 'rgba(255, 248, 220, 0.02)'; // Very slight warm
      } else if (temp >= 4000) {
        return 'rgba(255, 230, 179, 0.05)'; // Light warm
      } else if (temp >= 3000) {
        return 'rgba(255, 204, 119, 0.08)'; // Warm amber
      } else {
        return 'rgba(255, 167, 77, 0.12)'; // Strong warm orange
      }
    };

    document.documentElement.style.setProperty('--light-temperature-filter', getTemperatureFilter(currentTemp));
    document.documentElement.style.setProperty('--light-temperature-overlay', getOverlayColor(currentTemp));

  }, [currentTemp, isFeatureActive]);

  // This component doesn't render anything visible - it's just applying styles
  return null;
}