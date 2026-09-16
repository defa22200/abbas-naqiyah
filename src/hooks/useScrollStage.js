import { useState, useEffect, useRef } from 'react';

/**
 * useScrollStage — monotonic stage machine driven by scroll position.
 *
 * Arc: linen → moss (the reception night) → sage → mist → champagne.
 * A single dip into the moss night for the reception, then back into the light.
 * Uses a probe line at 45% of the viewport plus a dwell timer so stage flips
 * never flap back and forth across a section boundary.
 */
const SECTION_STAGE = {
  invocation: 'linen',
  hero: 'linen',
  lineage: 'linen',
  reception: 'moss',
  venues: 'sage',
  verse: 'mist',
  closing: 'champagne',
};

export function useScrollStage() {
  const [currentStage, setCurrentStage] = useState('linen');
  const [activeSection, setActiveSection] = useState('hero');
  const targetStageRef = useRef('linen');
  const dwellTimerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const probeY = scrollY + window.innerHeight * 0.45;

      const getDocTop = (id) => {
        const el = document.getElementById(id);
        if (!el) return Infinity;
        return el.getBoundingClientRect().top + scrollY;
      };

      const closingTop = getDocTop('closing');
      const verseTop = getDocTop('verse');
      const venuesTop = getDocTop('venues');
      const receptionTop = getDocTop('reception');
      const lineageTop = getDocTop('lineage');
      const heroTop = getDocTop('hero');

      let section = 'invocation';

      if (probeY >= closingTop - 140) section = 'closing';
      else if (probeY >= verseTop - 140) section = 'verse';
      else if (probeY >= venuesTop - 140) section = 'venues';
      else if (probeY >= receptionTop - 140) section = 'reception';
      else if (probeY >= lineageTop - 140) section = 'lineage';
      else if (probeY >= heroTop - 140) section = 'hero';

      setActiveSection(section);

      const nextStage = SECTION_STAGE[section] || 'linen';

      if (nextStage !== targetStageRef.current) {
        targetStageRef.current = nextStage;
        if (dwellTimerRef.current) clearTimeout(dwellTimerRef.current);
        dwellTimerRef.current = setTimeout(() => setCurrentStage(nextStage), 140);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (dwellTimerRef.current) clearTimeout(dwellTimerRef.current);
    };
  }, []);

  return { stage: currentStage, activeSection };
}
