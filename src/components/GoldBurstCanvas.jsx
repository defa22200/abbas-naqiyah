import React, { useEffect, useRef } from 'react';

/**
 * GoldBurstCanvas — Act 0 wax-fracture burst.
 *
 * - 14 tumbling jade / antique-gold wax shards with rotational momentum and gravity
 * - 28 drifting champagne-gold foil flecks with air drag and a shimmer fade
 */
export default function GoldBurstCanvas({ active = false, onComplete }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = (canvas.width = canvas.offsetWidth * dpr);
    const height = (canvas.height = canvas.offsetHeight * dpr);
    const cx = width / 2;
    const cy = height / 2;

    // 14 tumbling shards — celadon jade with occasional antique gold
    const WAX_COLORS = ['#93A899', '#5E7465', '#DDE6DE', '#C7A86B'];
    const waxShards = Array.from({ length: 14 }, (_, i) => {
      const angle = (i / 14) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const speed = (Math.random() * 5 + 3) * dpr;
      return {
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5 * dpr,
        size: (Math.random() * 6 + 4) * dpr,
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.28,
        alpha: 1,
        color: WAX_COLORS[Math.floor(Math.random() * WAX_COLORS.length)],
      };
    });

    // 28 drifting champagne-gold foil flecks
    const FOIL_COLORS = ['#F7EED8', '#E5D3A3', '#C7A86B'];
    const goldFoil = Array.from({ length: 28 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * 7 + 2) * dpr;
      return {
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2 * dpr,
        radius: (Math.random() * 2.5 + 1) * dpr,
        alpha: 1,
        color: FOIL_COLORS[Math.floor(Math.random() * FOIL_COLORS.length)],
      };
    });

    let frame = 0;
    const maxFrames = 58;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      waxShards.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.22 * dpr;
        s.vx *= 0.98;
        s.rotation += s.vRot;
        s.alpha = Math.max(0, 1 - frame / maxFrames);

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);
        ctx.globalAlpha = s.alpha;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.moveTo(-s.size, -s.size / 2);
        ctx.lineTo(s.size, -s.size / 3);
        ctx.lineTo(s.size / 2, s.size);
        ctx.lineTo(-s.size / 1.5, s.size / 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      goldFoil.forEach((g) => {
        g.x += g.vx;
        g.y += g.vy;
        g.vy += 0.08 * dpr;
        g.vx *= 0.96;
        g.alpha = Math.max(0, 1 - frame / (maxFrames * 0.9));

        ctx.save();
        ctx.globalAlpha = g.alpha;
        ctx.fillStyle = g.color;
        ctx.shadowColor = '#C7A86B';
        ctx.shadowBlur = 5 * dpr;
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      if (frame < maxFrames) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
        if (onComplete) onComplete();
      }
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none z-30"
    />
  );
}
