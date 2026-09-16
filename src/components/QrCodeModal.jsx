import React, { useEffect } from 'react';
import { X, Navigation } from 'lucide-react';
import { generateStyledQrSvg } from '../utils/qrGenerator';
import { isIOSDevice } from '../utils/fullscreen';

/**
 * QrCodeModal — one-tap QR navigation to the reception venue.
 */
export default function QrCodeModal({ venue, onClose }) {
  useEffect(() => {
    if (!venue) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [venue, onClose]);

  if (!venue) return null;

  // ponytail: accept both RECEPTION_EVENT (venueName) and VENUE_DATA (name) shapes.
  const venueName = venue.venueName || venue.name || '';
  const venueAddress = venue.venueAddress || venue.address || '';
  const isIOS = isIOSDevice();
  const mapUrl = isIOS ? venue.appleMapsUrl : venue.mapsUrl;

  const qrSvg = generateStyledQrSvg(venue.mapsUrl, {
    fgColor: '#322723',
    goldColor: '#C7A86B',
    bgColor: '#FAF7F2',
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-moss-deep/55 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`QR navigation for ${venueName}`}
    >
      <div
        className="relative w-full max-w-sm rounded-[26px] bg-gradient-to-b from-ivory-soft via-ivory to-ivory-card text-ink p-7 sm:p-8 shadow-silk-float border border-gold-hairline/65 overflow-hidden text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 jali-watermark opacity-25 pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-ink-soft/70 hover:text-ink hover:bg-sage-light/60 transition-colors cursor-pointer"
          aria-label="Close QR modal"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="relative block text-[10px] font-body tracking-[0.3em] uppercase text-sage-deep font-semibold mb-2">
          Venue QR Navigation
        </span>
        <h3 className="relative font-serif text-2xl text-ink font-semibold mb-1">{venueName}</h3>
        <p className="relative font-body text-xs text-ink-soft font-medium mb-5">{venueAddress}</p>

        {/* Framed QR */}
        <div className="relative mx-auto w-56 h-56 p-3 rounded-2xl bg-ivory-soft border border-gold-hairline/60 shadow-card-soft flex items-center justify-center mb-6">
          <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: qrSvg }} />
        </div>

        <p className="relative font-body text-xs text-ink-soft font-medium mb-5 leading-relaxed">
          Scan with any smartphone camera to launch direct navigation in Google Maps or Apple Maps.
        </p>

        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-gold-hairline via-gold-bright to-gold-hairline text-ink text-xs font-semibold tracking-wide shadow-gold-glow hover:brightness-105 active:scale-95 transition-all"
        >
          <Navigation className="w-4 h-4" />
          <span>Launch Directions Now</span>
        </a>
      </div>
    </div>
  );
}
