import React, { useEffect, useRef } from 'react';

/**
 * StardustRainfall — celestial gold stardust drifting over the invitation.
 *
 * Replaces the bride's floral petal fall: no florals, only gold foil motes and
 * embers. Scroll-velocity reactive, density-gated so text always stays readable,
 * and fully static under reduced-motion.
 */
const COLORS = [
  { r: 199, g: 168, b: 107 }, // antique gold foil
  { r: 158, g: 128, b: 67 },  // burnished gold
  { r: 147, g: 168, b: 153 }, // celadon sage
];

export default function StardustRainfall() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

    // Scroll velocity drives the drift
    let lastScrollY = window.scrollY;
    let velocity = 0;
    const handleScroll = () => {
      const currentY = window.scrollY;
      velocity = Math.min(Math.abs(currentY - lastScrollY) * 0.045, 3.2);
      lastScrollY = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const COUNT = window.innerWidth < 640 ? 26 : 44;

    class Mote {
      constructor(initial = false) {
        this.reset(initial);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : -30 * dpr;
        this.radius = (Math.random() * 1.4 + 0.6) * dpr;
        this.baseSpeedY = (Math.random() * 0.35 + 0.18) * dpr;
        this.speedX = (Math.random() - 0.5) * 0.16 * dpr;
        this.swayAngle = Math.random() * Math.PI * 2;
        this.swaySpeed = Math.random() * 0.016 + 0.006;
        this.swayAmplitude = (Math.random() * 1.4 + 0.4) * dpr;
        this.baseAlpha = Math.random() * 0.4 + 0.25;
        this.twinklePhase = Math.random() * Math.PI * 2;
        this.twinkleSpeed = Math.random() * 0.03 + 0.012;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.glow = Math.random() > 0.82;
      }

      update(boost) {
        this.swayAngle += this.swaySpeed;
        this.twinklePhase += this.twinkleSpeed;
        this.x += Math.sin(this.swayAngle) * this.swayAmplitude + this.speedX;
        this.y += this.baseSpeedY + boost * 0.9 * dpr;

        if (this.y > height + 30 * dpr || this.x < -40 * dpr || this.x > width + 40 * dpr) {
          this.reset(false);
        }
      }

      draw(context) {
        const twinkle = 0.75 + Math.sin(this.twinklePhase) * 0.25;
        context.globalAlpha = Math.max(0, this.baseAlpha * twinkle);
        context.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;

        // ponytail: no shadowBlur — halo is a second cheap arc, not a per-frame blur.
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();

        if (this.glow) {
          context.globalAlpha = Math.max(0, this.baseAlpha * twinkle * 0.35);
          context.beginPath();
          context.arc(this.x, this.y, this.radius * 2.6, 0, Math.PI * 2);
          context.fill();
        }
      }
    }

    const motes = Array.from({ length: COUNT }, () => new Mote(true));

    // Reduced motion — draw one static frame and stop
    if (reduceMotion) {
      motes.forEach((m) => m.draw(ctx));
      ctx.globalAlpha = 1;
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);
      };
    }

    let isRunning = !document.hidden;
    const handleVisibility = () => {
      isRunning = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      if (!isRunning) return;

      velocity *= 0.92;
      ctx.clearRect(0, 0, width, height);

      motes.forEach((m) => {
        m.update(velocity);
        m.draw(ctx);
      });

      ctx.globalAlpha = 1;
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-20 select-none"
    />
  );
}
