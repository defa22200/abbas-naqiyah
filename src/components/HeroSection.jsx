import React, { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import GoldMonogram from './GoldMonogram';
import { scrollTo as lenisScrollTo } from '../lib/smoothScroll';

/**
 * HeroSection — Act 2: Hero Beat.
 *
 * Groom-first name entrance (Abbas → gold ampersand → Naqiyah), an interactive
 * 3D-tilt A✦N monogram that opens the keepsake, and the reception's date & city.
 */
export default function HeroSection({ onOpenKeepsake }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const monogramRef = useRef(null);

  const handlePointerMove = (e) => {
    const el = monogramRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (py - 0.5) * -22, y: (px - 0.5) * 26 });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  const scrollToLineage = () => {
    lenisScrollTo('#lineage', { offset: -40 });
  };

  const nameClass =
    'font-calligraphy not-italic text-6xl sm:text-8xl md:text-9xl tracking-normal font-normal select-none leading-[1.22] sm:leading-[1.18] text-ink drop-shadow-[0_2px_10px_rgba(50,39,35,0.12)] overflow-visible inline-block px-4 pt-1 pb-4';

  return (
    <section
      id="hero"
      className="pt-8 pb-14 flex flex-col items-center justify-center text-center px-2 relative select-none"
      aria-label="Couple names and reception title"
    >
      {/* Ambient gold halo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[330px] sm:w-[540px] h-[330px] sm:h-[540px] bg-gold-bright/25 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 1. Interactive 3D tilt A✦N monogram → keepsake */}
      <motion.div
        initial={{ opacity: 0, scale: 0.86, rotateX: 28 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ perspective: 900 }}
        className="mb-6 relative flex items-center justify-center cursor-pointer"
        onClick={onOpenKeepsake}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenKeepsake?.();
          }
        }}
        title="Tap to view the countdown keepsake"
      >
        <div
          ref={monogramRef}
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            transformStyle: 'preserve-3d',
          }}
          className="relative w-32 h-28 sm:w-40 sm:h-36 flex items-center justify-center"
        >
          <span className="absolute inset-0 bg-gold-bright/40 rounded-full blur-2xl scale-75 animate-crown-glow" />
          <GoldMonogram className="relative z-10 text-6xl sm:text-7xl" palette="onLight" />
        </div>
      </motion.div>

      {/* 2. Staggered groom-first name beat */}
      <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center overflow-visible">
        {/* Groom — Abbas, first */}
        <motion.h1
          initial={{ opacity: 0, y: 26, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.15, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className={nameClass}
        >
          Abbas
        </motion.h1>

        {/* Gold calligraphic ampersand */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="my-0.5 sm:my-1 flex items-center justify-center gap-3 overflow-visible"
        >
          <span className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent via-gold-hairline/60 to-gold-hairline" />
          <span className="font-calligraphy not-italic text-4xl sm:text-5xl text-gold-burnished font-normal px-2">
            &amp;
          </span>
          <span className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent via-gold-hairline/60 to-gold-hairline" />
        </motion.div>

        {/* Bride — Naqiyah (full descender visible without any clipping) */}
        <motion.p
          initial={{ opacity: 0, y: 26, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.15, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className={nameClass}
        >
          Naqiyah
        </motion.p>
      </div>

      {/* 3. Tagline, event and date — clean single-line presentation */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, delay: 1.25, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6 sm:mt-8 flex flex-col items-center gap-2 text-center px-1 sm:px-4 max-w-lg mx-auto w-full"
      >
        <p
          className="font-body uppercase text-ink-soft font-semibold whitespace-nowrap select-none px-2 text-center"
          style={{
            fontSize: 'clamp(8.5px, 2.25vw, 12px)',
            letterSpacing: 'clamp(0.06em, 0.35vw, 0.18em)',
          }}
        >
          Two families · Two hearts · One beautiful beginning
        </p>

        <div className="flex items-center justify-center gap-2 my-1.5">
          <span className="h-px w-8 bg-gold-hairline" />
          <span className="text-gold-burnished text-xs">✦</span>
          <span className="h-px w-8 bg-gold-hairline" />
        </div>

        <p className="text-xs sm:text-sm font-body tracking-[0.28em] uppercase text-sage-deep font-semibold whitespace-nowrap">
          The Wedding Reception
        </p>

        <p className="font-serif text-2xl sm:text-3xl text-ink font-semibold tracking-wide whitespace-nowrap">
          Saturday, 19 December 2026
        </p>

        <p
          className="font-body uppercase text-ink-muted font-medium whitespace-nowrap text-center"
          style={{
            fontSize: 'clamp(9px, 2.1vw, 12px)',
            letterSpacing: 'clamp(0.08em, 0.25vw, 0.18em)',
          }}
        >
          11 Shehre Rajabul Asab 1448 (Eve) · Nagpur
        </p>
      </motion.div>

      {/* 4. Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 1.6 }}
        className="mt-9 sm:mt-12 flex flex-col items-center animate-soft-float"
      >
        <button
          onClick={scrollToLineage}
          className="flex flex-col items-center gap-1.5 text-ink-muted hover:text-gold-burnished transition-colors p-2 cursor-pointer"
          aria-label="Scroll to the invitation"
        >
          <span className="text-[10px] font-body tracking-[0.24em] uppercase">The Invitation</span>
          <span className="h-8 w-px bg-gradient-to-b from-sage to-transparent" />
          <ChevronDown className="w-4 h-4 -mt-1.5 text-sage-deep" />
        </button>
      </motion.div>
    </section>
  );
}
