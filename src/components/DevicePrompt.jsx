import React, { useState, useEffect } from 'react';
import { Smartphone, X } from 'lucide-react';

/**
 * DevicePrompt — Displays an elegant luxury banner on tablets, laptops, and desktops
 * recommending the phone for the best physical touch & motion experience.
 */
export default function DevicePrompt() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem('wedding:device-prompt-dismissed') === 'true') {
        return;
      }
    } catch (e) {}

    const checkDevice = () => {
      // Screens >= 768px (tablets, iPads, laptops, desktops)
      const isTabletOrLaptop = window.innerWidth >= 768;
      setIsVisible(isTabletOrLaptop);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      sessionStorage.setItem('wedding:device-prompt-dismissed', 'true');
    } catch (e) {}
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Device experience recommendation"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto select-none max-w-[92vw] sm:max-w-md animate-fade-in"
    >
      <div className="flex items-center gap-3 px-4 py-2.5 sm:px-5 sm:py-3 rounded-full bg-ivory-soft/95 text-ink shadow-[0_12px_36px_rgba(50,39,35,0.2)] border border-gold-hairline/80 backdrop-blur-md">
        <div className="w-8 h-8 rounded-full bg-gold-hairline/20 flex items-center justify-center shrink-0 text-gold-burnished">
          <Smartphone className="w-4 h-4" />
        </div>
        <div className="text-left pr-1">
          <p className="font-serif text-xs sm:text-sm font-semibold text-ink leading-snug tracking-wide">
            Designed For Mobile Experience
          </p>
          <p className="font-body text-[10px] sm:text-[11px] text-ink-muted leading-tight">
            For the best interactive animations, music &amp; full immersion, view on a phone.
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="p-1.5 rounded-full text-ink-muted hover:text-ink hover:bg-gold-hairline/20 transition-colors cursor-pointer shrink-0"
          aria-label="Dismiss recommendation"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
