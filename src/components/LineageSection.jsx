import React from 'react';
import { motion } from 'framer-motion';

/**
 * LineageSection — Act 3: Host & Lineage.
 *
 * The groom's parents issue the cordial invitation on pearl silk, then the
 * couple's parentage is set out groom-first (Abbas of the Mistry family, then
 * Naqiyah of the Shamim family) on soft celadon mist cards.
 */
export default function LineageSection() {
  return (
    <section
      id="lineage"
      className="py-14 px-4 sm:px-6 max-w-xl mx-auto text-center"
      aria-label="Host and family lineage"
    >
      {/* Primary host invitation card — pearl silk with gold filigree */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative p-6 sm:p-9 rounded-[26px] bg-gradient-to-b from-ivory-soft via-ivory to-ivory-card border border-gold-hairline/60 shadow-silk-float overflow-hidden"
      >
        <div className="absolute inset-0 jali-watermark opacity-[0.35] pointer-events-none" />
        <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-gold-hairline/80 pointer-events-none" />
        <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-gold-hairline/80 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-gold-hairline/80 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-gold-hairline/80 pointer-events-none" />

        <span className="relative text-[10px] font-body tracking-[0.3em] uppercase text-sage-deep font-semibold block mb-4">
          Cordial Invitation
        </span>

        <div className="relative font-serif text-lg sm:text-xl text-ink leading-relaxed max-w-md mx-auto">
          <strong className="font-normal text-ink text-2xl sm:text-3xl block mb-1 tracking-wide font-serif">
            Mrs. Nafisa
          </strong>
          <span className="text-xs sm:text-sm font-body tracking-wide text-ink-soft block mb-3 font-medium whitespace-nowrap">
            w/o Late Saifuddin Mistry (Battiwala)
          </span>
          <p className="text-sm sm:text-base leading-relaxed text-ink-soft">
            request the honour of your gracious presence at the wedding reception of their beloved grandson
          </p>
        </div>
      </motion.div>

      {/* Decorative filigree knot */}
      <div className="flex items-center justify-center gap-3 my-8">
        <span className="h-px w-16 bg-gradient-to-r from-transparent to-sage/60" />
        <span className="text-gold-burnished text-sm">✦</span>
        <span className="h-px w-16 bg-gradient-to-l from-transparent to-sage/60" />
      </div>

      {/* Couple Parentage / Lineage Cards with 'weds' in between */}
      <div className="flex flex-col items-center gap-4 text-center">
        {/* Groom Lineage */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="w-full p-6 sm:p-7 rounded-2xl bg-sage-mist border border-gold-hairline/45 shadow-silk-float backdrop-blur-md overflow-visible"
        >
          <span className="text-[9px] font-body tracking-[0.3em] uppercase text-sage-deep font-semibold block mb-2">
            The Groom
          </span>
          <h3 className="font-calligraphy not-italic text-5xl sm:text-6xl text-ink mb-1 font-normal leading-[1.2] py-1 px-3 overflow-visible inline-block">
            Abbas
          </h3>
          <p className="font-serif italic text-sm sm:text-base text-ink font-semibold whitespace-nowrap">
            (S/o. Mrs. Tasneem &amp; Mr. Shabbar Mistry)
          </p>
        </motion.div>

        {/* The 'weds' ligature verbatim from card */}
        <div className="my-1 flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-gold-hairline/60" />
          <span className="font-calligraphy not-italic text-4xl text-gold-burnished font-normal px-2">
            weds
          </span>
          <span className="h-px w-12 bg-gold-hairline/60" />
        </div>

        {/* Bride Lineage */}
        <motion.div
          initial={{ opacity: 0, x: 25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="w-full p-6 sm:p-7 rounded-2xl bg-sage-mist border border-gold-hairline/45 shadow-silk-float backdrop-blur-md overflow-visible"
        >
          <span className="text-[9px] font-body tracking-[0.3em] uppercase text-sage-deep font-semibold block mb-2">
            The Bride
          </span>
          <h3 className="font-calligraphy not-italic text-5xl sm:text-6xl text-ink mb-1 font-normal leading-[1.2] py-1 px-3 overflow-visible inline-block">
            Naqiyah
          </h3>
          <p className="font-serif italic text-sm sm:text-base text-ink font-semibold whitespace-nowrap">
            (D/o. Mrs. Ashrafunnisa &amp; Mr Moiz Shamim)
          </p>
        </motion.div>
      </div>
    </section>
  );
}
