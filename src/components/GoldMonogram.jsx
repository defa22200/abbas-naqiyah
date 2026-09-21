import React from 'react';

/**
 * GoldMonogram — Client's bespoke interlocking A✦N emblem.
 * Uses the authentic high-resolution logo asset provided by the client.
 */
export default function GoldMonogram({
  className = '',
  alt = 'Abbas & Naqiyah Monogram',
  palette = 'onLight',
  glow = false,
}) {
  const isLight = palette === 'onLight';
  const src = isLight ? '/images/an_monogram_gold.png' : '/images/an_monogram_pale.png';

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {glow && (
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gold-bright/35 rounded-full blur-2xl scale-90 pointer-events-none animate-crown-glow"
        />
      )}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain filter drop-shadow-[0_4px_14px_rgba(201,166,107,0.38)] transition-transform duration-300"
      />
    </div>
  );
}
