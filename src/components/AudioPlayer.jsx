import React, { useState, useRef, useEffect } from 'react';
import { VolumeX, Music, Maximize, Minimize } from 'lucide-react';
import { toggleFullscreen, isFullscreenActive } from '../utils/fullscreen';

/**
 * AudioPlayer — ambient Sufiyana oud, started only after the seal tap gesture.
 * Nothing autoplays on mount (no wasted bandwidth, no blocked-play warnings):
 * the envelope ceremony flips `autoPlayTrigger`, then we fade in. If the play
 * is still blocked, every pointerdown retries until it succeeds.
 */
export default function AudioPlayer({ autoPlayTrigger }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const audioRef = useRef(null);
  const fadeTimerRef = useRef(null);

  // Track fullscreen state
  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(isFullscreenActive());
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  useEffect(() => () => clearInterval(fadeTimerRef.current), []);

  // Gentle fade toward a target volume (avoids the abrupt 0→0.5 jump).
  const fadeTo = (audio, target, step = 0.06, intervalMs = 60) => {
    clearInterval(fadeTimerRef.current);
    fadeTimerRef.current = setInterval(() => {
      const next = audio.volume + (target > audio.volume ? step : -step);
      if (Math.abs(next - target) <= step) {
        audio.volume = target;
        clearInterval(fadeTimerRef.current);
      } else {
        audio.volume = Math.min(1, Math.max(0, next));
      }
    }, intervalMs);
  };

  const tryStart = () => {
    const audio = audioRef.current;
    if (!audio || !audio.paused) return;
    audio.volume = 0;
    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        fadeTo(audio, 0.5);
      })
      .catch(() => {});
  };

  // Start only on the ceremony gesture — retry on later gestures until playing
  useEffect(() => {
    if (!autoPlayTrigger) return;
    tryStart();
    const retry = () => {
      const audio = audioRef.current;
      if (audio && audio.paused) tryStart();
      else window.removeEventListener('pointerdown', retry);
    };
    window.addEventListener('pointerdown', retry);
    return () => window.removeEventListener('pointerdown', retry);
  }, [autoPlayTrigger]);

  const toggleSound = (e) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      fadeTo(audio, 0, 0.1, 40);
      setTimeout(() => {
        audio.pause();
        setIsPlaying(false);
      }, 220);
    } else {
      tryStart();
    }
  };

  const idleButton =
    'bg-ivory-soft/95 text-ink border border-gold-hairline/60 hover:border-gold-hairline hover:bg-ivory';
  const activeButton =
    'bg-gradient-to-r from-sage-deep via-sage to-sage-deep text-ivory border border-sage-deep shadow-gold-glow';

  return (
    <aside
      aria-label="Audio and fullscreen controls"
      className="fixed top-4 right-3 sm:top-5 sm:right-4 z-50 select-none flex items-center gap-1.5 sm:gap-2"
    >
      <audio
        ref={audioRef}
        loop
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src="/audio/sufi_oud_long.m4a" type="audio/mp4" />
        <source src="/audio/sufi_oud_long.mp3" type="audio/mpeg" />
      </audio>

      {/* Fullscreen toggle */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFullscreen();
        }}
        className={`flex items-center gap-1.5 py-2 px-2.5 sm:px-3 rounded-full transition-all duration-300 backdrop-blur-md shadow-silk-float active:scale-95 cursor-pointer ${
          isFullscreen ? activeButton : idleButton
        }`}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFullscreen ? (
          <Minimize className="w-3.5 h-3.5" />
        ) : (
          <Maximize className="w-3.5 h-3.5 text-gold-burnished" />
        )}
        <span className="hidden sm:inline text-[10px] font-body tracking-wider uppercase font-medium">
          {isFullscreen ? 'Exit' : 'Full Screen'}
        </span>
      </button>

      {/* Music control */}
      <button
        onClick={toggleSound}
        className={`group relative flex items-center gap-2 py-2 px-3 sm:px-3.5 rounded-full transition-all duration-300 backdrop-blur-md shadow-silk-float active:scale-95 cursor-pointer ${
          isPlaying ? activeButton : idleButton
        }`}
        aria-label={isPlaying ? 'Mute the Sufiyana oud' : 'Play the Sufiyana oud'}
        title={isPlaying ? 'Mute the Sufiyana oud' : 'Play the Sufiyana oud'}
      >
        {isPlaying ? (
          <>
            <Music className="w-3.5 h-3.5" />
            {/* Live equaliser */}
            <div className="flex items-end gap-0.5 h-3" aria-hidden="true">
              <span className="w-0.5 bg-ivory rounded-full animate-[pulse_0.9s_ease-in-out_infinite] h-2" />
              <span className="w-0.5 bg-ivory rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-3.5" />
              <span className="w-0.5 bg-ivory rounded-full animate-[pulse_1.1s_ease-in-out_infinite] h-1.5" />
              <span className="w-0.5 bg-ivory rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-2.5" />
            </div>
            <span className="text-[10px] font-body tracking-wider uppercase pl-0.5 font-semibold">
              Mute
            </span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5 text-sage-deep opacity-80 group-hover:opacity-100 transition-opacity" />
            <span className="text-[10px] font-body tracking-wider uppercase font-medium">
              Music Off
            </span>
          </>
        )}
      </button>
    </aside>
  );
}
