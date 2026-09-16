import React, { useState, useEffect, useRef } from 'react';
import { enterFullscreen } from '../utils/fullscreen';
import GoldBurstCanvas from './GoldBurstCanvas';
import GoldMonogram from './GoldMonogram';

/**
 * Procedural acoustic wax-fracture snap — synthesised entirely in the Web Audio API.
 * Zero external audio file dependency.
 *
 * Layered: dry filtered-noise fracture transient → sealing-wax body thud → secondary tick.
 */
export function playWaxSnap() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;

    // 1. Dry fracture transient — band-swept noise with a very fast decay
    const len = Math.floor(ctx.sampleRate * 0.09);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.18));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;

    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(2400, now);
    bp.frequency.exponentialRampToValueAtTime(900, now + 0.08);
    bp.Q.value = 1.6;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.34, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

    noise.connect(bp);
    bp.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);

    // 2. Sealing-wax body thud under the crack
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(210, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.14);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.001, now);
    oscGain.gain.linearRampToValueAtTime(0.22, now + 0.006);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.17);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);

    // 3. Secondary hairline tick
    const t2 = now + 0.055;
    const len2 = Math.floor(ctx.sampleRate * 0.03);
    const buf2 = ctx.createBuffer(1, len2, ctx.sampleRate);
    const d2 = buf2.getChannelData(0);
    for (let i = 0; i < len2; i++) {
      d2[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len2 * 0.12));
    }
    const noise2 = ctx.createBufferSource();
    noise2.buffer = buf2;
    const hp2 = ctx.createBiquadFilter();
    hp2.type = 'highpass';
    hp2.frequency.value = 3200;
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.16, t2);
    g2.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.05);
    noise2.connect(hp2);
    hp2.connect(g2);
    g2.connect(ctx.destination);
    noise2.start(t2);

    setTimeout(() => {
      try {
        ctx.close();
      } catch (err) {
        /* context already closed */
      }
    }, 700);
  } catch (err) {
    /* audio unavailable — ceremony continues silently */
  }
}

/**
 * EnvelopeCeremony — Act 0: The Wax Seal Opening.
 *
 * sealed → cracking → opening → rising → revealing → done
 *
 * A warm-alabaster envelope with hairline gold debossed seams and a celadon-gold
 * geometric damask lining. Its translucent celadon jade medallion is embossed with
 * the A✦N monogram in sculpted antique gold. One tap fractures the seal, hinges the
 * flap back in 3D, raises the pearl-silk reception card, then floods the frame with
 * warm champagne light before handing off to the invitation.
 */
export default function EnvelopeCeremony({ onComplete }) {
  const [phase, setPhase] = useState('sealed');
  const [isBurstActive, setIsBurstActive] = useState(false);
  const timersRef = useRef([]);
  const completedRef = useRef(false);
  const fsTriedRef = useRef(false);

  const tryFullscreenOnce = () => {
    if (fsTriedRef.current) return;
    fsTriedRef.current = true;
    enterFullscreen();
  };

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const finish = () => {
    setPhase('done');
    if (!completedRef.current) {
      completedRef.current = true;
      if (onComplete) onComplete();
    }
  };

  // Lock body scroll for the duration of the ceremony
  useEffect(() => {
    document.body.style.overflow = phase === 'done' ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [phase]);

  useEffect(() => clearTimers, []);

  const advance = (next, delay) => {
    timersRef.current.push(setTimeout(() => setPhase(next), delay));
  };

  const handleSealTap = (e) => {
    if (e) e.stopPropagation();
    if (phase !== 'sealed') return;

    tryFullscreenOnce();
    playWaxSnap();

    if (navigator.vibrate) {
      try {
        navigator.vibrate([15, 25, 15]);
      } catch (err) {
        /* haptics unsupported */
      }
    }

    setPhase('cracking');
    setIsBurstActive(true);

    advance('opening', 380);    // flap hinges back in 3D
    advance('rising', 900);     // reception card slides upward into view
    advance('revealing', 2100); // champagne light flood dissolves the overlay
    timersRef.current.push(setTimeout(finish, 2950));
  };

  // Tap anywhere mid-ceremony to fast-forward (cracking included — no dead taps)
  const handleFastForward = () => {
    tryFullscreenOnce();
    if (phase === 'cracking' || phase === 'opening' || phase === 'rising') {
      clearTimers();
      setPhase('revealing');
      timersRef.current.push(setTimeout(finish, 500));
    }
  };

  if (phase === 'done') return null;

  const sealGone = phase === 'opening' || phase === 'rising' || phase === 'revealing';
  const envelopeGone = phase !== 'sealed' && phase !== 'cracking';
  const cardVisible = phase === 'rising' || phase === 'revealing';

  return (
    <aside
      role="dialog"
      aria-modal="true"
      aria-label="Ceremonial wedding envelope"
      onClick={handleFastForward}
      className={`fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 select-none transition-all duration-1000 ${
        phase === 'revealing' ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'
      }`}
    >
      {/* 1. Airy alabaster & celadon mist backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-ivory-soft via-ivory to-sage-light transition-colors duration-1000" />
      <div className="absolute inset-0 sage-wash pointer-events-none" />
      <div className="absolute inset-0 stardust-field opacity-40 pointer-events-none" />

      {/* Warm champagne crown glow */}
      <div className="absolute w-[520px] sm:w-[760px] h-[520px] sm:h-[760px] gold-sheen rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute inset-0 linen-vignette pointer-events-none" />

      {/* 2. Champagne light flood during the reveal */}
      <div
        className={`absolute inset-0 bg-gradient-to-b from-ivory-soft via-gold-pale to-gold-bright pointer-events-none transition-opacity duration-1000 z-50 ${
          phase === 'revealing' ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* 3. The envelope & reception card */}
      <div
        style={{ perspective: 1200 }}
        className="relative w-full max-w-[360px] sm:max-w-[440px] flex flex-col items-center justify-center z-10"
      >
        <div className="relative w-full min-h-[268px] sm:min-h-[312px] flex items-center justify-center">

          {/* ============================================================
              LAYER 1 — The pearl-silk reception card
              ============================================================ */}
          <div
            style={{
              transform: cardVisible
                ? 'translate3d(0, -10px, 30px) scale(1.03)'
                : phase === 'opening'
                ? 'translate3d(0, 0px, 16px) scale(0.98)'
                : 'translate3d(0, 0px, 0px) scale(0.95)',
              opacity: cardVisible ? 1 : 0,
              transition: 'transform 0.95s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease',
              boxShadow: '0 26px 60px -18px rgba(50, 39, 35, 0.32), 0 0 46px -14px rgba(199, 168, 107, 0.55)',
              zIndex: 35,
            }}
            className={`w-full max-w-[352px] sm:max-w-[424px] rounded-[26px] bg-gradient-to-b from-ivory-soft via-ivory to-ivory-deep border border-gold-hairline/75 p-5 sm:p-7 flex flex-col items-center justify-between text-center overflow-hidden ${
              cardVisible ? 'relative pointer-events-auto' : 'absolute pointer-events-none'
            }`}
          >
            {/* Gold filigree corners */}
            <div className="absolute top-2.5 left-2.5 w-5 h-5 border-t-2 border-l-2 border-gold-hairline pointer-events-none" />
            <div className="absolute top-2.5 right-2.5 w-5 h-5 border-t-2 border-r-2 border-gold-hairline pointer-events-none" />
            <div className="absolute bottom-2.5 left-2.5 w-5 h-5 border-b-2 border-l-2 border-gold-hairline pointer-events-none" />
            <div className="absolute bottom-2.5 right-2.5 w-5 h-5 border-b-2 border-r-2 border-gold-hairline pointer-events-none" />
            <div className="absolute inset-2 rounded-[18px] border border-gold-hairline/35 pointer-events-none" />

            {/* Sacred Bismillah */}
            <div className="pt-1 space-y-1 relative z-10">
              <div
                dir="rtl"
                lang="ar"
                className="font-arabic text-2xl sm:text-3xl text-ink font-bold tracking-wide leading-relaxed"
              >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>
              <p className="font-serif italic text-xs sm:text-sm text-ink-soft font-semibold tracking-wider">
                In the name of Allah, the Most Beneficent, the Most Merciful
              </p>
            </div>

            {/* Monogram + names + title */}
            <div className="my-4 py-1 relative z-10 space-y-1.5">
              <GoldMonogram className="text-2xl sm:text-3xl" glow={false} palette="onLight" />

              <div className="flex items-center justify-center gap-2 mb-1 pt-1">
                <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold-hairline" />
                <span className="text-[9px] sm:text-[11px] font-body tracking-[0.3em] uppercase text-sage-deep font-semibold">
                  The Wedding Reception
                </span>
                <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold-hairline" />
              </div>

              <p className="font-calligraphy not-italic text-4xl sm:text-5xl md:text-6xl text-ink tracking-normal font-normal leading-tight px-2">
                Abbas &amp; Naqiyah
              </p>

              <p className="font-serif italic text-xs sm:text-sm text-ink-soft font-semibold mt-1">
                Two families · Two hearts · One beautiful beginning
              </p>
            </div>

            {/* Date & venue */}
            <div className="pb-1 space-y-2 relative z-10">
              <div className="flex items-center justify-center gap-2">
                <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold-hairline" />
                <span className="text-gold-burnished text-xs">✦</span>
                <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold-hairline" />
              </div>
              <p className="font-body text-[11px] sm:text-sm tracking-[0.2em] uppercase text-ink font-semibold">
                Saturday, 19 December 2026
              </p>
              <p className="font-serif italic text-[11px] sm:text-xs text-ink-soft">
                Dhawan Celebrations · Nagpur
              </p>
            </div>
          </div>

          {/* ============================================================
              LAYER 2 — The warm-alabaster envelope
              ============================================================ */}
          <div
            onClick={phase === 'sealed' ? handleSealTap : undefined}
            className={`transition-all duration-700 [transform-style:preserve-3d] ${
              envelopeGone
                ? 'absolute inset-0 translate-y-10 opacity-0 pointer-events-none'
                : 'relative w-full h-[256px] sm:h-[300px] cursor-pointer translate-y-0 opacity-100'
            }`}
            style={{ filter: 'drop-shadow(0 24px 44px rgba(50, 39, 35, 0.26))' }}
          >
            {/* 2A — Envelope back panel with celadon-gold geometric damask lining */}
            <div className="absolute inset-0 rounded-2xl bg-ivory-card border border-gold-hairline/60 overflow-hidden shadow-inner">
              <div className="absolute inset-0 damask-gold opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-b from-ivory-soft/70 via-transparent to-sage-light/45 pointer-events-none" />
            </div>

            {/* 2B — Front pocket flaps meeting at exact centre */}
            <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-2xl">
              <svg viewBox="0 0 460 300" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="alabasterPocket" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#F1EBE1" />
                    <stop offset="100%" stopColor="#FDFCF9" />
                  </linearGradient>
                  <linearGradient id="alabasterLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FDFCF9" />
                    <stop offset="100%" stopColor="#F4EFE6" />
                  </linearGradient>
                  <linearGradient id="alabasterRight" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FDFCF9" />
                    <stop offset="100%" stopColor="#F4EFE6" />
                  </linearGradient>
                </defs>

                {/* Hairline gold debossed seams */}
                <polygon points="0,0 230,150 0,300" fill="url(#alabasterLeft)" stroke="#C7A86B" strokeWidth="0.9" strokeOpacity="0.85" />
                <polygon points="460,0 230,150 460,300" fill="url(#alabasterRight)" stroke="#C7A86B" strokeWidth="0.9" strokeOpacity="0.85" />
                <polygon points="0,300 460,300 230,150" fill="url(#alabasterPocket)" stroke="#C7A86B" strokeWidth="1.1" strokeOpacity="0.9" />

                <line x1="20" y1="294" x2="225" y2="154" stroke="#E5D3A3" strokeWidth="0.9" opacity="0.9" />
                <line x1="440" y1="294" x2="235" y2="154" stroke="#E5D3A3" strokeWidth="0.9" opacity="0.9" />
              </svg>

              <div className="absolute bottom-3 inset-x-0 flex items-center justify-center opacity-80 pointer-events-none">
                <span className="font-serif italic text-[10px] sm:text-xs text-ink-muted tracking-[0.2em]">
                  ✦ &nbsp;The Wedding Reception&nbsp; ✦
                </span>
              </div>
            </div>

            {/* 2C — 3D hinging top flap */}
            <div
              style={{
                transformOrigin: 'top center',
                transform: phase === 'sealed' || phase === 'cracking' ? 'rotateX(0deg)' : 'rotateX(-145deg)',
                transition: 'transform 0.78s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease',
                opacity: phase === 'opening' ? 0.9 : 1,
                transformStyle: 'preserve-3d',
                zIndex: 25,
              }}
              className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none"
            >
              {/* Flap face (closed) */}
              <div
                style={{ backfaceVisibility: 'hidden' }}
                className="absolute inset-0 w-full h-full [clip-path:polygon(0_0,100%_0,50%_100%)] bg-gradient-to-b from-ivory-soft to-ivory-card shadow-md"
              >
                <svg viewBox="0 0 460 150" className="w-full h-full" preserveAspectRatio="none">
                  <polygon points="0,0 460,0 230,150" fill="none" stroke="#C7A86B" strokeWidth="1.2" strokeOpacity="0.95" />
                  <polygon points="12,4 448,4 230,140" fill="none" stroke="#E5D3A3" strokeWidth="0.8" opacity="0.8" />
                </svg>
              </div>

              {/* Flap reverse (celadon-gold damask revealed on opening) */}
              <div
                style={{ transform: 'rotateX(180deg)', backfaceVisibility: 'hidden' }}
                className="absolute inset-0 w-full h-full [clip-path:polygon(0_0,100%_0,50%_100%)] bg-sage-light overflow-hidden shadow-md"
              >
                <div className="absolute inset-0 damask-gold opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-t from-sage/35 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

            {/* 2D — The translucent celadon jade wax medallion, dead centre */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center justify-center pointer-events-auto">
              <GoldBurstCanvas active={isBurstActive} />

              <button
                onClick={handleSealTap}
                disabled={phase !== 'sealed'}
                aria-label="Tap the wax seal to open the invitation"
                className={`group relative p-1 rounded-full transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-hairline cursor-pointer ${
                  phase === 'sealed' ? 'hover:scale-105 active:scale-95' : ''
                } ${phase === 'cracking' ? 'scale-[1.12]' : ''} ${
                  sealGone ? 'opacity-0 scale-125 pointer-events-none' : ''
                }`}
              >
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
                  {/* Round celadon wax stamp — symmetric medallion, gold rim */}
                  <svg
                    viewBox="0 0 120 120"
                    className="absolute inset-0 w-full h-full drop-shadow-[0_10px_20px_rgba(94,116,101,0.35)]"
                  >
                    <defs>
                      <radialGradient id="waxJade" cx="36%" cy="28%" r="78%">
                        <stop offset="0%" stopColor="#CFDECF" />
                        <stop offset="46%" stopColor="#93A899" />
                        <stop offset="100%" stopColor="#5E7465" />
                      </radialGradient>
                      <linearGradient id="jadeGoldRim" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F7EED8" />
                        <stop offset="45%" stopColor="#E5D3A3" />
                        <stop offset="100%" stopColor="#9E8043" />
                      </linearGradient>
                      <radialGradient id="waxStampInner" cx="50%" cy="42%" r="65%">
                        <stop offset="0%" stopColor="#3A463B" stopOpacity="0.28" />
                        <stop offset="70%" stopColor="#3A463B" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#3A463B" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* Wax body */}
                    <circle cx="60" cy="60" r="52" fill="url(#waxJade)" />
                    {/* Stamped inner field */}
                    <circle cx="60" cy="60" r="44" fill="url(#waxStampInner)" />
                    {/* Gloss */}
                    <ellipse cx="45" cy="37" rx="19" ry="12" fill="#FDFCF9" opacity="0.22" />
                    {/* Gold rims */}
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="none"
                      stroke="url(#jadeGoldRim)"
                      strokeWidth="1.6"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="44"
                      fill="none"
                      stroke="url(#jadeGoldRim)"
                      strokeWidth="1"
                      opacity="0.9"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="38"
                      fill="none"
                      stroke="#F7EED8"
                      strokeWidth="0.5"
                      strokeDasharray="2 3"
                      opacity="0.7"
                    />
                  </svg>

                  {/* Sculpted antique gold A✦N */}
                  <GoldMonogram className="relative z-10 text-3xl sm:text-[2.1rem]" palette="onJade" glow={false} />

                  {/* Fracture lines on crack */}
                  {phase === 'cracking' && (
                    <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full z-20 animate-pulse">
                      <g stroke="#F7EED8" strokeWidth="1.1" strokeLinecap="round" opacity="0.95">
                        <path d="M60 60 L60 20" />
                        <path d="M60 60 L94 48" />
                        <path d="M60 60 L88 92" />
                        <path d="M60 60 L34 96" />
                        <path d="M60 60 L24 42" />
                      </g>
                      <g stroke="#3A463B" strokeWidth="0.7" strokeLinecap="round" opacity="0.7">
                        <path d="M60 22 L56 38 L62 46" />
                        <path d="M92 50 L78 58 L82 68" />
                      </g>
                    </svg>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* 4. Action affordance beneath the envelope */}
        {phase === 'sealed' && (
          <div className="mt-8 flex flex-col items-center text-center animate-fade-in">
            <button
              onClick={handleSealTap}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-3 rounded-full bg-ivory-soft/95 text-ink text-xs sm:text-sm font-medium tracking-[0.22em] uppercase shadow-silk-float hover:scale-105 active:scale-95 transition-all cursor-pointer border border-gold-hairline/80 shadow-gold-inset"
            >
              <span className="text-gold-burnished text-xs">✦</span>
              <span>Tap Seal to Open</span>
              <span className="text-gold-burnished text-xs">✦</span>
            </button>

            <span className="text-[11px] font-body tracking-[0.22em] uppercase text-ink-muted font-medium mt-3">
              Saturday, 19 December 2026 · Nagpur
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
