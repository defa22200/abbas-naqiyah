/**
 * Scroll choreography — continuous, scroll-linked colour and depth.
 *
 * Rather than flipping between discrete stage colours, this interpolates the
 * backdrop gradient *continuously* as each section enters, and writes the result
 * as CSS custom properties on <html> from a single rAF loop. Nothing re-renders
 * React per frame, so it stays at 60 fps.
 *
 * Exposed (with sensible fallbacks in index.css):
 *   --bg-a / --bg-b / --bg-c   the three radial-gradient stops
 *   --bg-x / --bg-y            the gradient's focal point, which drifts on scroll
 *   --stage-glow               champagne crown glow colour
 *   --stage-vignette           edge vignette colour
 *   --wash-opacity             strength of the celadon watercolour wash
 *   --scroll-velocity          0..1, recent scroll speed (drives glow breathing)
 *   --py                       per-element parallax offset (on [data-parallax])
 */

const PALETTE = {
  linen: {
    a: '#FDFCF9',
    b: '#FAF7F2',
    c: '#EEF3EF',
    glow: 'rgba(199, 168, 107, 0.20)',
    vignette: 'rgba(93, 84, 76, 0.08)',
    wash: 1,
  },
  moss: {
    a: '#3A463B',
    b: '#2B352E',
    c: '#1F2621',
    // Kept low: a strong champagne wash at the top would lift the moss away
    // from the dark it needs to be for the reception card to sit on.
    glow: 'rgba(229, 211, 163, 0.09)',
    vignette: 'rgba(15, 20, 17, 0.42)',
    wash: 0,
  },
  sage: {
    a: '#FDFCF9',
    b: '#EEF3EF',
    c: '#DDE6DE',
    glow: 'rgba(199, 168, 107, 0.18)',
    vignette: 'rgba(93, 84, 76, 0.08)',
    wash: 1,
  },
  mist: {
    a: '#FDFCF9',
    b: '#F4EFE6',
    c: '#E8DFD1',
    glow: 'rgba(229, 211, 163, 0.22)',
    vignette: 'rgba(93, 84, 76, 0.07)',
    wash: 1,
  },
  champagne: {
    a: '#FDF9F0',
    b: '#FAF7F2',
    c: '#F2E4C9',
    glow: 'rgba(229, 211, 163, 0.34)',
    vignette: 'rgba(93, 84, 76, 0.05)',
    wash: 1,
  },
};

/** Where each stage's colour should be fully reached. */
const ANCHORS = [
  { id: 'hero', stage: 'linen' },
  { id: 'reception', stage: 'moss' },
  { id: 'venues', stage: 'sage' },
  { id: 'verse', stage: 'mist' },
  { id: 'closing', stage: 'champagne' },
];

const toRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const mix = (c1, c2, t) => {
  const r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
  const g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
  const b = Math.round(c1[2] + (c2[2] - c1[2]) * t);
  return `rgb(${r}, ${g}, ${b})`;
};

/** Ease the blend so colours settle rather than ramp linearly. */
const smooth = (t) => t * t * (3 - 2 * t);
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

// Pre-parse every colour once
const RGB = Object.fromEntries(
  Object.entries(PALETTE).map(([stage, p]) => [
    stage,
    { a: toRgb(p.a), b: toRgb(p.b), c: toRgb(p.c) },
  ])
);

const RGBA_NUM = (str) => {
  const m = str.match(/[\d.]+/g);
  return m ? m.map(Number) : [0, 0, 0, 0];
};
const rgbaMix = (s1, s2, t) => {
  const a = RGBA_NUM(s1);
  const b = RGBA_NUM(s2);
  const out = a.map((v, i) => +(v + (b[i] - v) * t).toFixed(3));
  return `rgba(${out[0]}, ${out[1]}, ${out[2]}, ${out[3]})`;
};

let teardown = null;

export function initScrollChoreography() {
  if (typeof window === 'undefined' || teardown) return teardown;

  const root = document.documentElement;
  const reduceMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let segments = [];
  let parallaxEls = [];
  let frame = 0;
  let lastY = window.scrollY;
  let velocity = 0;
  let lastWritten = {};

  /**
   * Each stage owns its own section: the colour holds for the first `HOLD` of the
   * section's height, then blends into the next stage across the gap. Without the
   * hold the moss night would fade out while the reception card was still being read.
   */
  const HOLD = 0.68;

  const measure = () => {
    const scrollY = window.scrollY;
    segments = ANCHORS.map((entry) => {
      const el = document.getElementById(entry.id);
      if (!el) return null;
      const start = el.getBoundingClientRect().top + scrollY;
      const height = el.offsetHeight;
      return { stage: entry.stage, start, end: start + height * HOLD };
    }).filter(Boolean);
    parallaxEls = Array.from(document.querySelectorAll('[data-parallax]'));
  };

  /** Only touch the DOM when a value actually moved. */
  const write = (key, value) => {
    if (lastWritten[key] === value) return;
    lastWritten[key] = value;
    root.style.setProperty(key, value);
  };

  const paint = (fromStage, toStage, t) => {
    const from = PALETTE[fromStage];
    const to = PALETTE[toStage];
    const fromRgb = RGB[fromStage];
    const toRgb_ = RGB[toStage];
    const moving = fromStage !== toStage && t > 0;

    write('--bg-a', moving ? mix(fromRgb.a, toRgb_.a, t) : from.a);
    write('--bg-b', moving ? mix(fromRgb.b, toRgb_.b, t) : from.b);
    write('--bg-c', moving ? mix(fromRgb.c, toRgb_.c, t) : from.c);
    write('--stage-glow', moving ? rgbaMix(from.glow, to.glow, t) : from.glow);
    write('--stage-vignette', moving ? rgbaMix(from.vignette, to.vignette, t) : from.vignette);
    write('--wash-opacity', (moving ? from.wash + (to.wash - from.wash) * t : from.wash).toFixed(2));
  };

  const applyColour = (probe, vh) => {
    if (!segments.length) return;

    // Above the first stage, or below the last — just hold that stage
    if (probe <= segments[0].start) {
      paint(segments[0].stage, segments[0].stage, 0);
      return;
    }
    const last = segments[segments.length - 1];
    if (probe >= last.end) {
      paint(last.stage, last.stage, 0);
      return;
    }

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      const next = segments[i + 1];

      // Inside this stage's hold — full colour
      if (probe >= seg.start && probe <= seg.end) {
        paint(seg.stage, seg.stage, 0);
        return;
      }

      if (!next || next.start <= seg.end) continue;

      // Confine the blend to roughly the last 0.9 viewport before the next
      // stage, so each section is read at its own full colour rather than
      // drifting through a long muddy ramp.
      const lead = Math.min(next.start - seg.end, vh * 0.9);
      const blendStart = next.start - lead;

      if (probe > blendStart && probe < next.start) {
        const t = smooth(clamp01((probe - blendStart) / (next.start - blendStart)));
        paint(seg.stage, next.stage, t);
        return;
      }
    }

    paint(last.stage, last.stage, 0);
  };

  const applyParallax = () => {
    if (reduceMotion) return;
    const vh = window.innerHeight;

    for (let i = 0; i < parallaxEls.length; i++) {
      const el = parallaxEls[i];
      const rect = el.getBoundingClientRect();
      // -1 (below fold) → 0 (centred) → 1 (above fold)
      const centred = clamp01((vh - rect.top) / (vh + rect.height)) * 2 - 1;
      const strength = Number(el.dataset.parallax) || 16;
      const py = (-centred * strength).toFixed(1);
      if (el.__py !== py) {
        el.__py = py;
        el.style.setProperty('--py', `${py}px`);
      }
    }
  };

  const update = () => {
    frame = 0;

    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    const probe = scrollY + vh * 0.45;

    applyColour(probe, vh);

    // Scroll velocity — decays each frame, used for the glow's breathing
    const delta = Math.abs(scrollY - lastY);
    lastY = scrollY;
    velocity = Math.min(1, velocity * 0.88 + delta / 90);
    write('--scroll-velocity', velocity.toFixed(3));

    // Focal point drifts with the probe line so the light source travels
    const docHeight = Math.max(document.body.scrollHeight, 1);
    const progress = clamp01(scrollY / Math.max(docHeight - vh, 1));
    write('--bg-x', `${(50 + Math.sin(progress * Math.PI) * 6).toFixed(2)}%`);
    write('--bg-y', `${(30 + progress * 14).toFixed(2)}%`);

    applyParallax();

    // ponytail: keep decaying velocity after scroll stops so --scroll-velocity settles to 0.
    if (velocity > 0.003) {
      frame = requestAnimationFrame(function decay() {
        frame = 0;
        velocity *= 0.88;
        write('--scroll-velocity', velocity.toFixed(3));
        if (velocity > 0.003) schedule();
      });
    }
  };

  const schedule = () => {
    if (frame) return;
    frame = requestAnimationFrame(update);
  };

  const onResize = () => {
    measure();
    schedule();
  };

  measure();
  update();

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  // Web fonts land after first paint and shift section positions
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      measure();
      schedule();
    });
  }

  teardown = () => {
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', onResize);
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    teardown = null;
  };

  return teardown;
}
