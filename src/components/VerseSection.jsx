import React from 'react';
import { motion } from 'framer-motion';

/**
 * VerseSection — Act 6: Sacred Quranic Verse.
 *
 * A soft celadon-mist arch on pearl silk, ringed by a dashed gold border and an
 * ambient champagne halo — a serene pause before the closing blessing.
 */
export default function VerseSection() {
  return (
    <motion.section
      id="verse"
      initial={{ opacity: 0, scale: 0.96, y: 35 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
      className="py-20 sm:py-28 px-6 text-center max-w-2xl mx-auto relative rounded-t-[70px] sm:rounded-t-[92px] rounded-b-[26px] my-16 bg-gradient-to-b from-ivory-soft via-sage-mist to-sage-light border border-gold-hairline/55 shadow-silk-float overflow-hidden"
      aria-label="Sacred Quranic verse"
    >
      {/* Dashed gold arch border */}
      <div className="absolute inset-2.5 rounded-t-[60px] sm:rounded-t-[82px] rounded-b-[18px] border border-dashed border-gold-hairline/55 pointer-events-none" />

      {/* Ambient champagne halo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-[460px] h-80 sm:h-[460px] bg-gold-bright/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 jali-watermark opacity-25 pointer-events-none" />

      {/* Sacred rule */}
      <div className="flex items-center justify-center gap-4 mb-8 relative z-10">
        <span className="h-px w-14 sm:w-20 bg-gradient-to-r from-transparent to-gold-hairline" />
        <span className="text-gold-burnished text-base animate-pulse">✦</span>
        <span className="h-px w-14 sm:w-20 bg-gradient-to-l from-transparent to-gold-hairline" />
      </div>

      <blockquote className="space-y-7 relative z-10">
        <div
          dir="rtl"
          lang="ar"
          className="font-arabic text-2xl sm:text-4xl leading-[2.3] sm:leading-[2.5] tracking-wide font-bold select-all px-2 bg-gradient-to-b from-gold-hairline via-gold-burnished to-gold-deep bg-clip-text text-transparent drop-shadow-[0_1px_1px_rgba(253,252,249,0.9)]"
        >
          وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
        </div>

        <p className="font-serif italic text-base sm:text-xl text-ink-soft leading-relaxed max-w-lg mx-auto tracking-wide">
          &ldquo;And among His signs is that He created for you spouses from among yourselves so that
          you may find tranquility in them; and He placed between you affection and mercy.&rdquo;
        </p>

        <footer className="font-body text-[10px] sm:text-xs tracking-[0.3em] uppercase text-sage-deep font-semibold pt-1">
          Surah Ar-Rum 30:21
        </footer>
      </blockquote>

      <div className="flex items-center justify-center mt-9 relative z-10">
        <svg
          width="60"
          height="12"
          viewBox="0 0 60 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-gold-hairline"
          aria-hidden="true"
        >
          <circle cx="30" cy="6" r="2.5" fill="currentColor" />
          <line x1="0" y1="6" x2="22" y2="6" stroke="currentColor" strokeWidth="0.8" />
          <line x1="38" y1="6" x2="60" y2="6" stroke="currentColor" strokeWidth="0.8" />
        </svg>
      </div>
    </motion.section>
  );
}
