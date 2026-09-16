import React from 'react';

/**
 * GoldMonogram — bespoke interlocking A✦N mark in antique gold foil.
 * Pure type + ornament so the mark never depends on an external image asset.
 *
 * palette="onLight" → deeper foil that stays legible on pearl silk.
 * palette="onJade"  → lighter foil for the celadon jade wax medallion.
 */
const PALETTES = {
  onLight: {
    letter: 'from-gold-bright via-gold-hairline to-gold-burnished',
    star: 'from-gold-hairline to-gold-burnished',
    shadow: 'drop-shadow-[0_2px_6px_rgba(50,39,35,0.22)]',
    glow: 'bg-gold/25',
  },
  onJade: {
    letter: 'from-gold-pale via-gold-bright to-gold-hairline',
    star: 'from-gold-pale to-gold-bright',
    shadow: 'drop-shadow-[0_2px_8px_rgba(31,38,33,0.5)]',
    glow: 'bg-gold-bright/30',
  },
};

export default function GoldMonogram({
  className = '',
  starClass = '',
  glow = true,
  palette = 'onLight',
}) {
  const tone = PALETTES[palette] || PALETTES.onLight;

  return (
    <span className={`relative inline-flex items-center justify-center leading-none ${className}`}>
      {glow && (
        <span
          aria-hidden="true"
          className={`absolute inset-0 rounded-full blur-2xl scale-90 pointer-events-none animate-crown-glow ${tone.glow}`}
        />
      )}
      <span className="relative z-10 inline-flex items-baseline tracking-[0.06em] font-serif">
        <span
          className={`bg-gradient-to-b ${tone.letter} bg-clip-text text-transparent ${tone.shadow}`}
        >
          A
        </span>
        <span
          aria-hidden="true"
          className={`mx-[0.14em] bg-gradient-to-b ${tone.star} bg-clip-text text-transparent ${starClass}`}
          style={{ fontSize: '0.55em' }}
        >
          ✦
        </span>
        <span
          className={`bg-gradient-to-b ${tone.letter} bg-clip-text text-transparent ${tone.shadow}`}
        >
          N
        </span>
      </span>
    </span>
  );
}
