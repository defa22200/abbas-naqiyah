import React from 'react';
import { motion } from 'framer-motion';
import VenueCard from './VenueCard';

/**
 * VenuesSection — Act 5: Venue & Navigation Guide.
 *
 * A single venue layout focused exclusively on Dhawan Celebrations.
 */
export const VENUE_DATA = {
  id: 'dhawan',
  name: 'Dhawan Celebrations',
  address: 'Gorewada Ring Road, Nagpur, Maharashtra',
  eventLabel: 'The Wedding Reception',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Dhawan+Celebrations,+Gorewada+Ring+Road,+Nagpur',
  appleMapsUrl: 'https://maps.apple.com/?q=Dhawan+Celebrations,+Gorewada+Ring+Road,+Nagpur',
};

export default function VenuesSection({ onOpenQr }) {
  return (
    <section
      id="venues"
      className="py-16 px-4 sm:px-6 max-w-xl mx-auto space-y-10"
      aria-label="Venue and directions"
    >
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center space-y-2.5"
      >
        <span className="text-[10px] font-body tracking-[0.3em] uppercase text-sage-deep font-semibold">
          ✦ Navigation &amp; Directions ✦
        </span>
        <h2 className="font-serif text-4xl sm:text-5xl text-ink tracking-tight font-normal">
          The Venue
        </h2>
        <p className="font-body text-xs sm:text-sm text-ink-soft max-w-md mx-auto">
          Geocoded directions, one tap away — so you arrive without a single wrong turn.
        </p>
      </motion.div>

      <VenueCard venue={VENUE_DATA} onOpenQr={onOpenQr} />
    </section>
  );
}
