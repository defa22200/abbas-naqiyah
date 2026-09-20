import React, { useState, useEffect } from 'react';
import InvocationSection from './components/InvocationSection';
import HeroSection from './components/HeroSection';
import LineageSection from './components/LineageSection';
import ReceptionSection from './components/ReceptionSection';
import VenuesSection from './components/VenuesSection';
import VerseSection from './components/VerseSection';
import ClosingSection from './components/ClosingSection';
import HeaderNav from './components/HeaderNav';
import AudioPlayer from './components/AudioPlayer';
import EnvelopeCeremony from './components/EnvelopeCeremony';
import PhaseBackgroundEngine from './components/PhaseBackgroundEngine';
import StardustRainfall from './components/StardustRainfall';
import Spatial3DMotionCanvas from './components/Spatial3DMotionCanvas';
import KeepsakeModal from './components/KeepsakeModal';
import QrCodeModal from './components/QrCodeModal';
import DevicePrompt from './components/DevicePrompt';
import { useScrollStage } from './hooks/useScrollStage';
import { initSmoothScroll, getLenis } from './lib/smoothScroll';
import { initScrollChoreography } from './lib/scrollChoreography';

const STAGE_THEME_COLOR = {
  linen: '#FAF7F2',
  moss: '#1F2621',
  sage: '#EEF3EF',
  mist: '#F4EFE6',
  champagne: '#FAF7F2',
};

export default function App() {
  const { stage, activeSection } = useScrollStage();
  const [isCeremonyDone, setIsCeremonyDone] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).has('skipCeremony');
    }
    return false;
  });
  const [isKeepsakeOpen, setIsKeepsakeOpen] = useState(false);
  const [selectedQrVenue, setSelectedQrVenue] = useState(null);
  const [musicTrigger, setMusicTrigger] = useState(false);

  // Trigger background music the instant the seal is broken (same tap gesture)
  const handleCardShow = () => {
    setMusicTrigger(true);
  };

  const handleCeremonyComplete = () => {
    setIsCeremonyDone(true);
    setMusicTrigger(true);
    initSmoothScroll();
    // ponytail: ceremony locked scroll at top — re-measure now that layout settles.
    requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
  };

  // Continuous scroll-linked colour & depth choreography
  useEffect(() => {
    const destroy = initScrollChoreography();
    return () => {
      if (typeof destroy === 'function') destroy();
    };
  }, []);

  // Lock / resume smooth scroll while a modal is open.
  // ponytail: Lenis is null on touch — body overflow is the fallback lock.
  useEffect(() => {
    const modalOpen = isKeepsakeOpen || selectedQrVenue;
    const lenis = getLenis();
    if (lenis) {
      if (modalOpen) lenis.stop();
      else lenis.start();
    }
    document.body.style.overflow = modalOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isKeepsakeOpen, selectedQrVenue]);

  // Keep browser chrome in step with the stage palette
  useEffect(() => {
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) return;
    metaTheme.setAttribute(
      'content',
      isCeremonyDone ? STAGE_THEME_COLOR[stage] || '#FAF7F2' : '#FAF7F2'
    );
  }, [stage, isCeremonyDone]);

  return (
    <div className="min-h-screen relative overflow-x-clip text-ink antialiased">
      {/* Act 0 — 3D wax seal envelope ceremony */}
      {!isCeremonyDone && (
        <EnvelopeCeremony 
          onComplete={handleCeremonyComplete} 
          onCardShow={handleCardShow}
        />
      )}

      {/* Continuously choreographed stage backdrop */}
      <PhaseBackgroundEngine />

      {/* Paper grain & gold jali texture */}
      <div className="fixed inset-0 pointer-events-none paper-texture opacity-30 -z-10" />
      <div className="fixed inset-0 pointer-events-none jali-watermark opacity-[0.12] -z-10" />

      {/* Spatial three.js layer — lazily initialised after Act 0 */}
      <Spatial3DMotionCanvas stage={stage} isReady={isCeremonyDone} />

      {/* Narrative. Each act sits on a [data-parallax] wrapper so the scrubbed
          depth offset never fights the transform Framer Motion owns inside. */}
      <main className="relative z-10 max-w-xl mx-auto pt-6 sm:pt-12 pb-28 sm:pb-32">
        <div data-parallax="10">
          <InvocationSection />
        </div>

        <div data-parallax="18">
          <HeroSection onOpenKeepsake={() => setIsKeepsakeOpen(true)} />
        </div>

        <div data-parallax="16">
          <LineageSection />
        </div>

        <div data-parallax="20">
          <ReceptionSection onOpenQr={(venue) => setSelectedQrVenue(venue)} />
        </div>

        <div data-parallax="14">
          <VenuesSection onOpenQr={(venue) => setSelectedQrVenue(venue)} />
        </div>

        <div data-parallax="12">
          <VerseSection />
        </div>

        <div data-parallax="8">
          <ClosingSection onOpenKeepsake={() => setIsKeepsakeOpen(true)} />
        </div>
      </main>

      {/* Celestial gold stardust */}
      <StardustRainfall />

      {/* Floating quick navigation */}
      <HeaderNav activeSection={activeSection} />

      {/* Ambient oud player */}
      <AudioPlayer autoPlayTrigger={musicTrigger} />

      {/* Keepsake card */}
      <KeepsakeModal isOpen={isKeepsakeOpen} onClose={() => setIsKeepsakeOpen(false)} />

      {/* Venue QR navigation */}
      <QrCodeModal venue={selectedQrVenue} onClose={() => setSelectedQrVenue(null)} />

      {/* Desktop / Tablet mobile recommendation banner */}
      <DevicePrompt />
    </div>
  );
}
