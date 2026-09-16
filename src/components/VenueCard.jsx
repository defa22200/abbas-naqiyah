import React, { useState } from 'react';
import { MapPin, Navigation, Share2, Check } from 'lucide-react';
import { generateStyledQrSvg } from '../utils/qrGenerator';
import { isIOSDevice, copyText } from '../utils/fullscreen';

/**
 * VenueCard — a single destination card with a minimal architectural vector map,
 * a pulsing gold pin, geocoded address and copy-to-clipboard.
 */
export default function VenueCard({ venue, onOpenQr }) {
  const [copied, setCopied] = useState(false);
  const isIOS = isIOSDevice();
  const mapUrl = isIOS ? venue.appleMapsUrl : venue.mapsUrl;

  const handleCopy = async () => {
    const ok = await copyText(`${venue.name}, ${venue.address}`);
    if (!ok) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const qrSvg = generateStyledQrSvg(venue.mapsUrl, {
    fgColor: '#322723',
    goldColor: '#C7A86B',
    bgColor: '#FAF7F2',
  });

  return (
    <div
      id={venue.id}
      className="rounded-[26px] bg-ivory border border-gold-hairline/50 shadow-silk-float overflow-hidden"
    >
      {/* Minimal architectural vector map */}
      <div className="relative h-48 sm:h-56 bg-sage-mist overflow-hidden border-b border-gold-hairline/40 flex items-center justify-center">
        <svg
          viewBox="0 0 400 200"
          className="w-full h-full opacity-70 pointer-events-none"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <pattern id={`grid-${venue.id}`} width="36" height="36" patternUnits="userSpaceOnUse">
              <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#93A899" strokeWidth="0.4" opacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#grid-${venue.id})`} />

          {/* Arterial roads */}
          <path d="M-20 58 Q120 178 260 88 T420 138" fill="none" stroke="#93A899" strokeWidth="7" strokeLinecap="round" opacity="0.65" />
          <path d="M58 -20 Q158 108 318 220" fill="none" stroke="#C7A86B" strokeWidth="4.5" strokeLinecap="round" opacity="0.6" />
          <path d="M222 0 L242 200" fill="none" stroke="#E5D3A3" strokeWidth="2.5" opacity="0.75" />

          {/* Block footprints */}
          <g fill="#93A899" opacity="0.18">
            <rect x="60" y="40" width="34" height="26" rx="2" />
            <rect x="110" y="80" width="44" height="30" rx="2" />
            <rect x="280" y="46" width="38" height="24" rx="2" />
            <rect x="300" y="120" width="46" height="32" rx="2" />
          </g>

          <text x="46" y="164" fill="#5E7465" fontSize="10" fontFamily="sans-serif" letterSpacing="1.4" opacity="0.9">
            GOREWADA RING ROAD
          </text>
        </svg>

        {/* Pulsing gold pin */}
        <div className="absolute z-10 flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            <span className="absolute w-14 h-14 rounded-full bg-gold-hairline/35 animate-pin-pulse" />
            <span className="absolute w-14 h-14 rounded-full bg-gold-bright/25 animate-pin-pulse [animation-delay:0.6s]" />
            <div className="relative z-10 p-3 rounded-full bg-ivory-soft text-gold-burnished shadow-gold-glow border border-gold-hairline">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <span className="mt-2 px-3 py-0.5 rounded-full bg-ivory-soft/95 text-ink text-[10px] font-body font-semibold tracking-wide shadow-card-soft border border-gold-hairline/60">
            {venue.name}
          </span>
        </div>

        <div className="absolute bottom-2.5 right-3 px-2 py-0.5 rounded bg-ivory-soft/95 text-[10px] font-body text-ink-muted border border-gold-hairline/45">
          Nagpur, Maharashtra
        </div>
      </div>

      {/* Details & actions */}
      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <span className="text-[10px] font-body tracking-[0.22em] uppercase text-sage-deep font-semibold block mb-1.5">
              {venue.eventLabel}
            </span>
            <h4 className="font-serif text-2xl sm:text-3xl text-ink">{venue.name}</h4>
            <p className="font-body text-xs sm:text-sm text-ink-soft mt-1 select-text">{venue.address}</p>
          </div>

          {/* QR thumbnail — taps open the large QR modal */}
          <button
            onClick={() =>
              onOpenQr?.({
                venueName: venue.name,
                venueAddress: venue.address,
                mapsUrl: venue.mapsUrl,
                appleMapsUrl: venue.appleMapsUrl,
              })
            }
            className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 p-1.5 rounded-xl border border-gold-hairline/55 bg-ivory-soft shadow-card-soft active:scale-95 transition-transform cursor-pointer"
            title="Scan for navigation"
            aria-label={`Show QR code for ${venue.name}`}
          >
            <div className="w-full h-full pointer-events-none" dangerouslySetInnerHTML={{ __html: qrSvg }} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mt-6">
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-11 flex items-center justify-center gap-2 px-3 rounded-xl bg-gradient-to-r from-gold-hairline via-gold-bright to-gold-hairline text-ink text-xs sm:text-sm font-semibold tracking-wide shadow-gold-glow hover:brightness-105 active:scale-95 transition-all"
          >
            <Navigation className="w-4 h-4" />
            <span>Open in Maps</span>
          </a>

          <button
            onClick={handleCopy}
            className={`h-11 px-3 rounded-xl border text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 transition-colors active:scale-95 cursor-pointer ${
              copied
                ? 'border-sage text-sage-ink bg-sage-light/60 font-semibold'
                : 'border-gold-hairline/55 text-ink-soft hover:bg-sage-light/40'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-sage-deep" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-gold-burnished" />
                <span>Copy Address</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
