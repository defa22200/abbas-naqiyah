import React, { useState, useEffect } from 'react';
import { Compass, X, MapPin, Sparkles } from 'lucide-react';
import { scrollTo as lenisScrollTo } from '../lib/smoothScroll';

/**
 * HeaderNav — floating quick-jump dock. Appears once the hero beat is cleared.
 */
export default function HeaderNav({ activeSection }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 340);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  const handleNavClick = (id) => {
    lenisScrollTo(`#${id}`, { offset: -40 });
  };

  const navItems = [
    { id: 'lineage', label: 'Invitation' },
    { id: 'reception', label: 'Reception', icon: Sparkles },
    { id: 'venues', label: 'Venue', icon: MapPin },
    { id: 'closing', label: 'Blessing' },
  ];

  return (
    <nav
      aria-label="Quick navigation"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 ease-out"
    >
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-ivory-soft/95 text-ink text-xs font-medium border border-gold-hairline/60 shadow-silk-float backdrop-blur-md active:scale-95 transition-transform cursor-pointer"
          aria-label="Expand quick navigation"
        >
          <Compass className="w-3.5 h-3.5 text-gold-burnished animate-spin-slow" />
          <span>Quick Navigation</span>
        </button>
      ) : (
        <div className="flex items-center gap-1.5 p-1.5 bg-ivory-soft/95 text-ink rounded-full shadow-silk-float backdrop-blur-md border border-gold-hairline/55 max-w-[95vw]">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-1.5 rounded-full text-xs transition-all duration-300 whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-sage-deep via-sage to-sage-deep text-ivory font-semibold shadow-sm'
                    : 'text-ink-soft hover:text-ink hover:bg-sage-light/60'
                }`}
              >
                {item.icon && <item.icon className="w-3 h-3" />}
                {item.label}
              </button>
            );
          })}

          <div className="w-px h-4 bg-gold-hairline/45 mx-0.5" />

          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 rounded-full text-ink-muted hover:text-ink hover:bg-sage-light/60 transition-colors cursor-pointer"
            aria-label="Minimize navigation"
            title="Minimize navigation"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </nav>
  );
}
