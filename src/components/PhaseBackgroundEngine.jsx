import React, { useEffect, useRef } from 'react';

/**
 * PhaseBackgroundEngine — the continuously choreographed stage backdrop.
 *
 * The gradient's three stops, its focal point, the crown glow and the vignette
 * are all CSS custom properties written per-frame by `src/lib/scrollChoreography.js`,
 * so colour melts smoothly as each section enters instead of snapping between
 * fixed stage plates.
 *
 * The only animated canvas here is the gold stardust, DPR-clamped to <= 2.
 */
export default function PhaseBackgroundEngine() {
  const canvasRef = useRef(null);

  // Floating gold stardust motes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = (canvas.width = window.innerWidth * dpr);
    let height = (canvas.height = window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const handleResize = () => {
      width = canvas.width = window.innerWidth * dpr;
      height = canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    const particleCount = window.innerWidth < 768 ? 18 : 30;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: (Math.random() * 1.6 + 0.7) * dpr,
      vx: (Math.random() - 0.5) * 0.15 * dpr,
      vy: (-Math.random() * 0.2 - 0.08) * dpr,
      baseAlpha: Math.random() * 0.4 + 0.25,
      phase: Math.random() * Math.PI * 2,
    }));

    let t = 0;
    let isPaused = document.hidden;
    const handleVisibility = () => {
      isPaused = document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      if (isPaused) return;

      t += 0.01;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        const alpha = p.baseAlpha + Math.sin(t + p.phase) * 0.12;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(199, 168, 107, ${Math.max(0, alpha)})`;
        ctx.fill();
      });
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <aside
      aria-hidden="true"
      className="fixed inset-0 w-full h-[100dvh] pointer-events-none -z-30 overflow-hidden select-none"
    >
      {/* Continuously interpolated stage gradient */}
      <div className="absolute inset-0 live-bg" />

      {/* Airy celadon watercolour wash — fades out over the moss night */}
      <div className="absolute inset-0 sage-wash" style={{ opacity: 'var(--wash-opacity, 1)' }} />

      {/* Champagne crown glow, breathing with scroll velocity */}
      <div
        className="absolute -top-40 left-1/2 w-[720px] h-[520px] live-glow"
        style={{ transform: 'translateX(-50%) scale(calc(1 + var(--scroll-velocity, 0) * 0.14))' }}
      />

      {/* Celestial stardust field */}
      <div className="absolute inset-0 stardust-field opacity-40 pointer-events-none" />

      {/* Floating gold motes */}
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-55 z-10" />

      {/* Stage-aware vignette */}
      <div className="absolute inset-0 live-vignette" />
    </aside>
  );
}
