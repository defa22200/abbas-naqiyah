import React from 'react';
import { motion } from 'framer-motion';

/**
 * InvocationSection — Act 1: Sacred Invocation.
 *
 * A Fatimid mihrab arch hairline draws itself, the Thuluth Bismillah burns in
 * antique gold, and the Fatimid Dua Mubarak honouring the Duat Mutlaqeen is
 * recited verbatim.
 */
export default function InvocationSection() {
  return (
    <header
      id="invocation"
      className="pt-24 sm:pt-32 pb-6 px-3 text-center max-w-lg mx-auto relative"
      aria-label="Opening Sacred Invocation"
    >
      {/* Fatimid arch / mihrab hairline, self-drawing */}
      <div className="flex items-center justify-center mb-4">
        <svg
          width="120"
          height="82"
          viewBox="0 0 120 82"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-gold-hairline"
          aria-hidden="true"
        >
          <motion.path
            d="M12 78 L12 40 C12 24 30 14 60 6 C90 14 108 24 108 40 L108 78"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.path
            d="M22 78 L22 44 C22 32 36 24 60 18 C84 24 98 32 98 44 L98 78"
            stroke="currentColor"
            strokeWidth="0.6"
            strokeOpacity="0.6"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.circle
            cx="60"
            cy="52"
            r="2"
            fill="currentColor"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          />
        </svg>
      </div>

      {/* Thuluth Bismillah in antique gold */}
      <div className="relative my-3 flex flex-col justify-center items-center">
        <div className="absolute inset-0 bg-gold-bright/35 blur-3xl scale-90 pointer-events-none rounded-full" />
        <div
          dir="rtl"
          lang="ar"
          className="font-arabic text-4xl sm:text-6xl font-bold tracking-wider leading-[2.3] py-2 overflow-visible select-all relative z-10 bg-gradient-to-b from-gold-hairline via-gold-burnished to-gold-deep bg-clip-text text-transparent drop-shadow-[0_1px_1px_rgba(253,252,249,0.9)]"
        >
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </div>
        <p className="font-serif italic text-sm sm:text-base text-ink-soft font-medium mt-2 tracking-wider">
          In the name of Allah, the Most Beneficent, the Most Merciful
        </p>
      </div>

      {/* Fine gold rule */}
      <div className="flex items-center justify-center gap-2 my-4">
        <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold-hairline" />
        <span className="text-gold-burnished text-xs">✦</span>
        <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold-hairline" />
      </div>

      {/* Verbatim Fatimid Dua Mubarak */}
      <p className="font-serif italic text-sm sm:text-base text-ink-soft leading-relaxed px-2 tracking-wide">
        By the Grace of Allah and Vasila-e-Panjatan-e-Paak
        <span className="text-[11px] font-body not-italic text-ink-muted font-semibold"> (A.S.)</span> and dua mubarak of
        <br />
        <span className="font-semibold text-ink">
          Dr. Syedna Mohammed Burhanuddin
          <span className="text-[10px] font-body not-italic text-ink-muted font-semibold"> (R.A.)</span>
        </span>
        <span className="text-gold-burnished"> &amp; </span>
        <br />
        <span className="font-semibold text-ink">
          Dr. Syedna Aali Qadr Mufaddal Saifuddin
          <span className="text-[10px] font-body not-italic text-ink-muted font-semibold"> (T.U.S.)</span>
        </span>
      </p>
    </header>
  );
}
