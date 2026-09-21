import React, { useState, useEffect, useRef } from 'react';
import { X, Share2, Check } from 'lucide-react';
import GoldMonogram from './GoldMonogram';
import { RECEPTION_TIMESTAMP, SHARE_URL } from '../utils/calendar';

/**
 * KeepsakeModal — a screenshot-ready pearl-silk save-the-date card carrying the
 * A✦N monogram, the reception details and a live countdown.
 */
export default function KeepsakeModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const update = () => {
      const diff = RECEPTION_TIMESTAMP - Date.now();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handlePointerMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setTilt({ x: (y - 50) * -0.14, y: (x - 50) * 0.14 });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  if (!isOpen) return null;

  const handleShare = async () => {
    const shareData = {
      title: 'Abbas & Naqiyah — The Wedding Reception',
      text: 'Two families · Two hearts · One beautiful beginning. Saturday, 19 December 2026 · Dhawan Celebrations, Nagpur.',
      url: SHARE_URL,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err && err.name === 'AbortError') return;
        /* fall through to clipboard */
      }
    }

    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      /* clipboard unavailable */
    }
  };

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Mins', value: timeLeft.minutes },
    { label: 'Secs', value: timeLeft.seconds },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-moss-deep/55 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Keepsake save-the-date card"
    >
      <div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full max-w-sm rounded-[26px] bg-gradient-to-b from-ivory-soft via-ivory to-ivory-deep text-ink px-5 py-6 sm:p-8 shadow-silk-float border border-gold-hairline/70 overflow-hidden text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 jali-watermark opacity-25 pointer-events-none" />

        {/* Gold corner filigree */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-gold-hairline/80 pointer-events-none" />
        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-gold-hairline/80 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-gold-hairline/80 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-gold-hairline/80 pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-ink-soft/70 hover:text-ink hover:bg-sage-light/60 transition-colors cursor-pointer"
          aria-label="Close keepsake card"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="relative block text-[10px] font-body tracking-[0.3em] uppercase text-sage-deep font-semibold">
          ✦ Save The Date · Keepsake ✦
        </span>

        <div className="relative my-3 flex justify-center">
          <GoldMonogram className="w-20 h-16" glow={false} palette="onLight" />
        </div>

        <div className="relative space-y-1 overflow-visible">
          <h2 className="font-calligraphy not-italic text-5xl sm:text-6xl text-ink font-normal leading-[1.22] py-1.5 px-2 whitespace-nowrap overflow-visible drop-shadow-sm">
            Abbas &amp; Naqiyah
          </h2>
          <p className="font-body uppercase text-ink-muted font-semibold whitespace-nowrap text-[8.5px] min-[390px]:text-[9px] tracking-[0.04em] px-2">
            Two families · Two hearts · One beautiful beginning
          </p>
        </div>

        <div className="relative flex items-center justify-center gap-3 my-4">
          <span className="h-px w-10 bg-gold-hairline/70" />
          <span className="text-gold-burnished text-xs">✦</span>
          <span className="h-px w-10 bg-gold-hairline/70" />
        </div>

        <div className="relative space-y-1">
          <p className="font-serif text-xl text-ink font-semibold whitespace-nowrap">The Wedding Reception</p>
          <p className="font-serif text-base text-ink-soft font-semibold whitespace-nowrap">Saturday, 19 December 2026</p>
          <p className="font-body text-[10px] sm:text-xs tracking-[0.16em] text-ink-muted uppercase font-semibold whitespace-nowrap">
            11 Shehre Rajabul Asab 1448 (Eve) · 8:00 PM
          </p>
          <p className="font-body text-xs font-semibold text-ink pt-0.5 whitespace-nowrap">
            Dhawan Celebrations · Nagpur
          </p>
        </div>

        {/* Live countdown */}
        <div className="relative mt-4 mb-5 p-3 rounded-2xl bg-sage-mist border border-gold-hairline/40">
          <p className="text-[9px] font-body uppercase tracking-[0.24em] text-sage-deep mb-2 font-semibold">
            Counting Down
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            {units.map((u) => (
              <div key={u.label} className="p-1.5 rounded-lg bg-ivory-soft border border-gold-hairline/25">
                <span className="font-serif text-base sm:text-lg font-semibold text-ink block tabular-nums">
                  {String(u.value).padStart(2, '0')}
                </span>
                <span className="text-[8px] font-body text-ink-muted font-semibold uppercase">
                  {u.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleShare}
          className="relative w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-gradient-to-r from-gold-hairline via-gold-bright to-gold-hairline text-ink text-xs font-semibold tracking-wide shadow-gold-glow hover:brightness-105 active:scale-95 transition-all cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          <span>{copied ? 'Link Copied!' : 'Share Invitation Link'}</span>
        </button>

        <p className="relative mt-2.5 text-[9px] font-body text-ink-muted font-medium">
          Tip: screenshot this card to keep it in your photos.
        </p>
      </div>
    </div>
  );
}
