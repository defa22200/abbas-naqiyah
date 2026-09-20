import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Clock, MapPin, Navigation, Share2, Check, Download, ExternalLink, QrCode, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { RECEPTION_EVENT, getGoogleCalendarUrl, downloadCalendarEvent } from '../utils/calendar';
import { isIOSDevice, copyText } from '../utils/fullscreen';

/**
 * ReceptionSection — Act 4: The Reception Showcase.
 *
 * The single event of the invitation, presented as one grand card on a rich deep
 * moss / espresso vignette — the one night-dark moment in an otherwise airy
 * invitation — framed with champagne stardust and gold filigree. The card tracks
 * pointer / touch in 3D with a radial gold sheen.
 */
export default function ReceptionSection({ onOpenQr }) {
  const [copied, setCopied] = useState(false);
  const [calendarMenuOpen, setCalendarMenuOpen] = useState(false);
  const [sheenPos, setSheenPos] = useState({ x: 50, y: 50 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const event = RECEPTION_EVENT;

  const handlePointerMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSheenPos({ x, y });
    setTilt({ x: (y - 50) * -0.045, y: (x - 50) * 0.045 });
  };

  const handlePointerLeave = () => {
    setSheenPos({ x: 50, y: 50 });
    setTilt({ x: 0, y: 0 });
  };

  const handleCopyAddress = async () => {
    const ok = await copyText(`${event.venueName}, ${event.venueAddress}`);
    if (!ok) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const isIOS = isIOSDevice();
  const mapDirectionsUrl = isIOS ? event.appleMapsUrl : event.mapsUrl;

  // Escape closes the calendar menu
  useEffect(() => {
    if (!calendarMenuOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setCalendarMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [calendarMenuOpen]);

  return (
    <section
      id="reception"
      className="py-16 px-4 sm:px-6 max-w-xl mx-auto space-y-10"
      aria-label="The Wedding Reception"
    >
      {/* Section header — sits inside the moss night stage, so it reads light */}
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center space-y-2.5"
      >
        <span className="text-[10px] font-body tracking-[0.3em] uppercase text-gold-hairline font-semibold">
          ✦ The Celebration ✦
        </span>
        <h2 className="font-serif text-4xl sm:text-5xl text-ivory tracking-tight font-normal drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
          You Are Invited
        </h2>
        <p className="font-body text-xs sm:text-sm text-ivory/75 font-medium max-w-sm mx-auto">
          One evening of starlit grandeur, as two families become one.
        </p>
      </motion.div>

      {/* The featured reception card — deep moss night */}
      <motion.article
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="relative rounded-[26px] p-7 sm:p-9 moss-night border border-gold-hairline/50 shadow-moss-float overflow-visible"
      >
        {/* Clipped backdrop décor — lives in its own wrapper so the calendar
            popup (below) is never cut off by overflow-hidden. */}
        <div className="absolute inset-0 overflow-hidden rounded-[26px] pointer-events-none" aria-hidden="true">
          {/* Champagne stardust drifting over the moss */}
          <div className="absolute inset-0 stardust-field opacity-45" />

          {/* Radial gold sheen tracking the pointer */}
          <div
            className="absolute inset-0 opacity-70 mix-blend-screen transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${sheenPos.x}% ${sheenPos.y}%, rgba(229,211,163,0.28) 0%, transparent 58%)`,
            }}
          />
          {/* Static champagne crown glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-48 bg-gold-hairline/25 blur-3xl rounded-full" />
        </div>

        {/* Gold filigree borders */}
        <div className="absolute inset-2 rounded-[20px] border border-gold-hairline/25 pointer-events-none" />
        <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-gold-hairline/70 pointer-events-none" />
        <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-gold-hairline/70 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-gold-hairline/70 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-gold-hairline/70 pointer-events-none" />

        {/* Header ribbon */}
        <div className="relative z-10 flex items-center justify-between gap-4 mb-6">
          <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-body uppercase tracking-[0.2em] font-semibold px-3 py-1.5 rounded-full border border-gold-hairline/50 text-gold-bright bg-gold-hairline/10">
            <Sparkles className="w-3 h-3" />
            Event · The Wedding Reception
          </span>
        </div>

        <h3 className="relative z-10 font-serif text-3xl sm:text-4xl text-ivory tracking-tight mb-4 font-normal whitespace-nowrap">
          The Wedding Reception
        </h3>

        {/* Date block */}
        <div className="mb-6 space-y-1 relative z-10">
          <p className="font-serif text-xl sm:text-2xl font-semibold text-gold-bright whitespace-nowrap">
            {event.gregorian}
          </p>
          <p className="text-xs sm:text-sm font-body tracking-wider font-medium text-ivory/70 whitespace-nowrap">
            ✦ {event.hijri}
          </p>
        </div>

        {/* Timing */}
        <div className="flex items-start gap-3 mb-6 relative z-10">
          <Clock className="w-5 h-5 shrink-0 mt-0.5 text-gold-hairline" />
          <div>
            <p className="font-serif text-lg sm:text-xl font-semibold text-ivory leading-snug whitespace-nowrap">
              {event.timeLabel}
            </p>
            <p className="font-serif italic text-sm sm:text-base mt-0.5 text-gold-bright/90 whitespace-nowrap">
              {event.program}
            </p>
          </div>
        </div>

        {/* Venue */}
        <div className="flex items-start gap-3 mb-8 relative z-10">
          <MapPin className="w-5 h-5 shrink-0 mt-0.5 text-gold-hairline" />
          <div className="flex-1">
            <p className="font-serif text-lg sm:text-xl font-semibold text-ivory leading-snug">
              {event.venueName}
            </p>
            <p className="text-sm font-body mt-0.5 text-ivory/70">{event.venueAddress}</p>

            <button
              onClick={handleCopyAddress}
              className={`mt-2 text-xs font-body flex items-center gap-1.5 transition-colors cursor-pointer ${
                copied ? 'text-gold-bright font-semibold' : 'text-gold-hairline hover:text-gold-bright font-medium'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Address copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Copy address</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-5 border-t border-gold-hairline/25 flex flex-col sm:flex-row gap-2.5 relative z-10">
          <a
            href={mapDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-11 px-4 rounded-xl text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer sm:flex-1 bg-gradient-to-r from-gold-hairline via-gold-bright to-gold-hairline text-ink shadow-gold-glow hover:brightness-105"
          >
            <Navigation className="w-4 h-4" />
            <span>Get Directions</span>
          </a>

          <div className="flex gap-2 sm:flex-1">
            <div className="relative flex-1">
              <button
                onClick={() => setCalendarMenuOpen(!calendarMenuOpen)}
                className="w-full h-11 px-3 rounded-xl border border-gold-hairline/50 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors active:scale-95 cursor-pointer text-ivory hover:bg-gold-hairline/12"
                aria-label="Add to Calendar options"
                aria-expanded={calendarMenuOpen}
                aria-haspopup="menu"
              >
                <Calendar className="w-4 h-4 text-gold-hairline" />
                <span>Add to Calendar</span>
              </button>

              {calendarMenuOpen && (
                <>
                  <div className="fixed inset-0 z-20 cursor-default" onClick={() => setCalendarMenuOpen(false)} />
                  <div
                    className="absolute bottom-full mb-2 left-0 sm:left-auto sm:right-0 w-60 rounded-2xl bg-ivory text-ink p-2 shadow-silk-float border border-gold-hairline/50 z-30 animate-fade-in"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-2 border-b border-gold-hairline/25 mb-1">
                      <span className="text-[10px] font-body uppercase tracking-widest font-semibold block">
                        Choose Calendar
                      </span>
                    </div>

                    <a
                      href={getGoogleCalendarUrl(event)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setCalendarMenuOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs hover:bg-sage-light/60 transition-colors font-semibold"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-gold-burnished" />
                      <span>Google Calendar</span>
                    </a>

                    <button
                      onClick={() => {
                        downloadCalendarEvent(event);
                        setCalendarMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs hover:bg-sage-light/60 transition-colors text-left font-semibold cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-gold-burnished" />
                      <span>Apple Calendar / Outlook</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => onOpenQr(event)}
              className="w-11 h-11 shrink-0 rounded-xl border border-gold-hairline/50 transition-colors flex items-center justify-center active:scale-95 cursor-pointer text-gold-bright hover:bg-gold-hairline/12"
              title="Show QR code for the venue"
              aria-label="Show QR code for the venue"
            >
              <QrCode className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.article>
    </section>
  );
}
