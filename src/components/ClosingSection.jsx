import React, { useState, useEffect } from 'react';
import { Share2, Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { RECEPTION_START_ISO, SHARE_URL } from '../utils/calendar';

const TARGET = new Date(RECEPTION_START_ISO).getTime();

const COMPLIMENTS = [
  'Mrs. Rizwana Mistry w/o Late Shabbir Mistry (Battiwala)',
  'Mrs. Zaheda Shakeel Abbas & Shakeel Abbas (Kiranawala)',
  'Mrs. Zainab Sunelwala & Mustufa Sunelwala',
  'Nisreen Mistry',
];

/**
 * ClosingSection — Act 7: Closing Blessings & Keepsake.
 *
 * The Mistry family's compliments, the closing blessing on warm champagne silk,
 * a live countdown to 8:00 PM on 19 December 2026, and share / keepsake actions.
 */
export default function ClosingSection({ onOpenKeepsake }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const update = () => {
      const diff = TARGET - Date.now();
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
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: 'Abbas & Naqiyah — The Wedding Reception',
      text: 'Two families · Two hearts · One beautiful beginning. The Wedding Reception — Saturday, 19 December 2026, Dhawan Celebrations, Nagpur.',
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
      setTimeout(() => setCopied(false), 2400);
    } catch (err) {
      /* clipboard unavailable */
    }
  };

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <section
      id="closing"
      className="py-16 px-4 sm:px-6 max-w-xl mx-auto text-center space-y-10"
      aria-label="Family compliments and closing blessing"
    >
      {/* 1. With Best Compliments From */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="relative p-7 sm:p-9 rounded-[26px] bg-gradient-to-b from-ivory-soft via-ivory to-ivory-card border border-gold-hairline/55 shadow-silk-float space-y-4 overflow-hidden"
      >
        <div className="absolute inset-0 jali-watermark opacity-25 pointer-events-none" />

        <span className="relative text-[10px] sm:text-xs font-body tracking-[0.3em] uppercase text-sage-deep font-semibold block">
          With Best Compliments From
        </span>

        <div className="relative space-y-2 font-serif text-[13.5px] sm:text-[15.5px] text-ink leading-relaxed">
          {COMPLIMENTS.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        <div className="relative pt-4 mt-4 border-t border-gold-hairline/35">
          <p className="font-body text-[11px] sm:text-xs tracking-[0.24em] text-gold-burnished uppercase font-semibold whitespace-nowrap">
            Together with all relatives &amp; friends
          </p>
        </div>
      </motion.div>

      {/* 2. Closing blessing */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative p-8 sm:p-10 rounded-[26px] bg-gradient-to-b from-gold-pale via-ivory-soft to-ivory border border-gold-hairline/55 shadow-silk-float space-y-5 overflow-hidden"
      >
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-40 bg-gold-bright/40 blur-3xl rounded-full pointer-events-none" />

        <p className="relative font-serif italic text-xl sm:text-2xl leading-relaxed text-ink">
          &ldquo;Your presence will make our celebration complete; your blessings will make our journey
          more beautiful.&rdquo;
        </p>

        <div className="relative flex items-center justify-center gap-2 pt-1 overflow-visible">
          <span className="text-xs text-gold-burnished">✦</span>
          <span className="font-calligraphy not-italic text-3xl sm:text-4xl text-gold-burnished px-2 py-1 leading-[1.25] overflow-visible inline-block whitespace-nowrap">
            Abbas &amp; Naqiyah
          </span>
          <span className="text-xs text-gold-burnished">✦</span>
        </div>
      </motion.div>

      {/* 3. Live countdown ticker */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-gold-burnished" />
          <span className="text-[10px] font-body tracking-[0.3em] uppercase text-sage-deep font-semibold whitespace-nowrap">
            Counting Down To The Reception
          </span>
          <Sparkles className="w-3.5 h-3.5 text-gold-burnished" />
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto">
          {units.map((u) => (
            <div
              key={u.label}
              className="p-3 sm:p-4 rounded-2xl bg-ivory-soft border border-gold-hairline/45 shadow-card-soft"
            >
              <span className="block font-serif text-2xl sm:text-3xl font-semibold text-ink tabular-nums">
                {String(u.value).padStart(2, '0')}
              </span>
              <span className="block mt-1 text-[9px] font-body tracking-[0.2em] uppercase text-ink-muted font-semibold">
                {u.label}
              </span>
            </div>
          ))}
        </div>

        {/* 4. Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-gold-hairline via-gold-bright to-gold-hairline text-ink text-xs font-semibold tracking-[0.16em] uppercase shadow-gold-glow hover:brightness-105 transition-all active:scale-95 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied' : 'Share Invitation'}</span>
          </button>

          <button
            onClick={onOpenKeepsake}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-gold-hairline/70 text-ink-soft text-xs font-semibold tracking-[0.16em] uppercase hover:bg-sage-light/50 transition-all active:scale-95 cursor-pointer"
          >
            <span className="text-xs text-gold-burnished">✦</span>
            <span>Open Keepsake</span>
          </button>
        </div>
      </div>

      {/* 5. Footer */}
      <footer className="pt-6 pb-4">
        <div className="p-6 rounded-[26px] bg-ivory-card border border-gold-hairline/50 shadow-card-soft space-y-3 text-center max-w-md mx-auto">
          <p className="font-serif text-sm sm:text-base font-semibold text-ink tracking-wide whitespace-nowrap">
            Saturday, 19 December 2026 · Nagpur, Maharashtra
          </p>

          <div className="flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-gold-hairline/70" />
            <span className="text-[10px] text-gold-burnished">✦</span>
            <span className="h-px w-8 bg-gold-hairline/70" />
          </div>

          <p className="font-serif italic text-[10px] min-[390px]:text-[11px] sm:text-xs text-ink-soft tracking-tight whitespace-nowrap">
            Two families · Two hearts · One beautiful beginning
          </p>
        </div>
      </footer>
    </section>
  );
}
