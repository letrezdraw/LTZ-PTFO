import { useEffect, useState } from 'react';

/**
 * Hook to detect device capabilities and performance metrics
 * Returns configuration for rendering heavy effects
 */
export const useDeviceCapability = () => {
  const [capability, setCapability] = useState({
    isMobile: false,
    isLowPower: false,
    isTablet: false,
    pixelRatio: 1,
    maxFPS: 60,
    supportsWebGL2: false,
    prefersReducedMotion: false,
  });

  useEffect(() => {
    // Check if mobile/tablet
    const isMobileUA = /iPhone|iPad|iPod|Android|Mobile|Tablet/i.test(navigator.userAgent);
    const isTabletUA = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);

    // Fallback to viewport width (helps in emulators/desktop UA)
    const isSmallViewport = typeof window !== 'undefined' && window.innerWidth < 768;

    const isMobile = isMobileUA || isSmallViewport;
    const isTablet = isTabletUA || (window.innerWidth < 1024 && window.innerWidth >= 768);
    
    // Check if low power mode (iOS)
    const isLowPower = navigator.getBattery ? true : false;
    
    // Get pixel ratio
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    
    // Check WebGL2 support
    const canvas = document.createElement('canvas');
    const supportsWebGL2 = !!canvas.getContext('webgl2');
    
    // Check prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Estimate FPS based on device
    let maxFPS = 60;
    if (isMobile || isTablet) maxFPS = 30;
    if (isLowPower) maxFPS = 24;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCapability({
      isMobile,
      isLowPower,
      isTablet,
      pixelRatio,
      maxFPS,
      supportsWebGL2,
      prefersReducedMotion,
    });
  }, []);

  return capability;
};
