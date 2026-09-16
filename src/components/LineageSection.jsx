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
  const nameGold =
    'font-calligraphy not-italic font-normal bg-gradient-to-b from-gold-hairline via-gold-burnished to-gold-deep bg-clip-text text-transparent';

  return (
    <section
      id="lineage"
      className="py-16 px-4 sm:px-6 max-w-xl mx-auto text-center"
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
          <p className="text-2xl sm:text-3xl font-normal mb-1 tracking-wide text-ink">
            Mr. Shabbar &amp; Mrs. Tasneem Mistry
          </p>
          <p className="text-sm sm:text-base leading-relaxed text-ink-soft mt-3">
            cordially request the honour of your presence at the Wedding Reception of their beloved son
          </p>
        </div>

        <div className="relative flex items-center justify-center gap-3 my-5">
          <span className="h-px w-12 bg-gold-hairline/70" />
          <span className="text-gold-burnished text-xs">✦</span>
          <span className="h-px w-12 bg-gold-hairline/70" />
        </div>

        <p className={`relative text-5xl sm:text-6xl leading-tight ${nameGold}`}>Abbas</p>
        <p className="relative font-serif italic text-base sm:text-lg text-sage-deep my-1">with</p>
        <p className={`relative text-5xl sm:text-6xl leading-tight ${nameGold}`}>Naqiyah</p>

        <p className="relative font-serif italic text-sm sm:text-base text-ink-soft mt-4">
          (Daughter of Mr. Moiz Shamim &amp; Mrs. Ashrafunnisa)
        </p>
      </motion.div>

      {/* Filigree knot */}
      <div className="flex items-center justify-center gap-3 my-10">
        <span className="h-px w-16 bg-gradient-to-r from-transparent to-sage/60" />
        <span className="text-gold-burnished text-sm">✦</span>
        <span className="h-px w-16 bg-gradient-to-l from-transparent to-sage/60" />
      </div>

      {/* Parentage — groom first */}
      <div className="flex flex-col items-center gap-4 text-center">
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full p-6 sm:p-7 rounded-2xl bg-sage-mist border border-gold-hairline/45 shadow-silk-float backdrop-blur-md"
        >
          <span className="text-[9px] font-body tracking-[0.3em] uppercase text-sage-deep font-semibold block mb-2">
            The Groom
          </span>
          <h3 className={`text-5xl sm:text-6xl mb-1 ${nameGold}`}>Abbas</h3>
          <p className="font-serif italic text-sm sm:text-base text-ink-soft font-medium">
            (S/o Mr. Shabbar &amp; Mrs. Tasneem Mistry)
          </p>
        </motion.div>

        <div className="my-1 flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-gold-hairline/60" />
          <span className="font-calligraphy not-italic text-4xl text-gold-burnished font-normal px-2">weds</span>
          <span className="h-px w-12 bg-gold-hairline/60" />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full p-6 sm:p-7 rounded-2xl bg-sage-mist border border-gold-hairline/45 shadow-silk-float backdrop-blur-md"
        >
          <span className="text-[9px] font-body tracking-[0.3em] uppercase text-sage-deep font-semibold block mb-2">
            The Bride
          </span>
          <h3 className={`text-5xl sm:text-6xl mb-1 ${nameGold}`}>Naqiyah</h3>
          <p className="font-serif italic text-sm sm:text-base text-ink-soft font-medium">
            (D/o Mr. Moiz Shamim &amp; Mrs. Ashrafunnisa)
          </p>
        </motion.div>
      </div>
    </section>
  );
}
