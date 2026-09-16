# PRD — "Abbas & Naqiyah: The Wedding Reception"
## Groom's-side cinematic invitation · v1.0

| | |
|---|---|
| **Project** | `abbas-naqiyah-reception-invitation` (Vite 6 · React 19 · Tailwind 3.4 · Framer Motion 13 · three.js 0.185 · Lenis 1.3 · GSAP 3) |
| **Event** | **The Wedding Reception** — Saturday, 19 December 2026, 8:00 PM onwards, Dhawan Celebrations, Gorewada Ring Road, Nagpur |
| **Hierarchy** | Groom-first: **Abbas & Naqiyah**. Hosts: **Mr. Shabbar & Mrs. Tasneem Mistry** |
| **North Star** | An airy, tactile digital invitation — warm pearl silk, muted celadon sage and antique gold foil, with one deep moss night reserved for the reception. Phone-first, silky at 60 fps |
| **Assets** | **Zero external image or audio dependencies.** Envelope, wax medallion, monogram, backgrounds, textures and the wax-fracture snap are all procedural (CSS / SVG / Canvas / Web Audio) |

---

## 1. Scope rules (from the client voice note)

1. **Single event focus.** The only event is the Wedding Reception. All Nikah, Poolside Luncheon, Hakimimasjid, timeline-scrubber and multi-event content is deleted — components, data and assets.
2. **Typography lock.** Fonts are unchanged from the bride's version: `Allura` / `Alex Brush` / `Great Vibes` (calligraphy), `Cormorant Garamond` / `Fraunces` (editorial serif), `Amiri` (Arabic), `Plus Jakarta Sans` (body & numerals).
3. **Aesthetic — "Celadon Sage & Champagne Linen" (Option A).** Soft mineral pastels, luminous cream silk and warm antique gold. No pastel-pink floral wash, no heavy midnight onyx:
   - Canvas / base — Warm Pearl Silk `#FAF7F2` (`#FDFCF9` soft, `#F4EFE6` card, `#E8DFD1` border)
   - Primary accent — Muted Celadon Sage `#93A899` (`#DDE6DE` wash, `#EEF3EF` mist, `#5E7465` deep)
   - Gold foil — Honey Champagne `#C7A86B` / `#E5D3A3` / `#F7EED8` / antique `#9E8043`
   - Typography ink — Warm Roast Espresso `#322723` (never harsh black)
   - **Reserved night** — deep moss / espresso vignette `#2B352E → #1F2621`, used only for the reception card and its stage
   - Accents: celestial stardust, gold jali / celadon-gold damask line-art
4. **Hierarchy.** Groom-first throughout; the groom's parents issue the invitation.

## 2. Experience — act by act

| Act | Component | Content |
|---|---|---|
| 0 | `EnvelopeCeremony.jsx` | Fullscreen `z-[60]` overlay, body scroll locked. Warm-alabaster envelope (`#F4EFE6`) with hairline gold debossed seams and a celadon-gold geometric damask lining; centred translucent celadon **jade** wax medallion embossed **A✦N** in sculpted antique gold. Tap: haptic `[15,25,15]` + Web Audio wax-fracture snap → 14 tumbling jade/gold wax shards + 28 champagne foil flecks → flap hinges `rotateX(0 → -145°)` → reception card rises → warm champagne light flood dissolves the overlay; Lenis engages |
| 1 | `InvocationSection.jsx` | `pt-24 sm:pt-32` clearing the fixed audio controls. Fatimid arch hairline draws itself. Radiant gold Thuluth Bismillah + English translation. Verbatim Fatimid Dua Mubarak honouring Dr. Syedna Mohammed Burhanuddin (R.A.) & Dr. Syedna Aali Qadr Mufaddal Saifuddin (T.U.S.) |
| 2 | `HeroSection.jsx` | Interactive 3D-tilt **A✦N** monogram → opens `KeepsakeModal`. Staggered entrance: **Abbas** → gold calligraphic ampersand → **Naqiyah**. Tagline *"Two families · Two hearts · One beautiful beginning"*. `Saturday, 19 December 2026 · Nagpur` |
| 3 | `LineageSection.jsx` | Pearl-silk host card: **Mr. Shabbar & Mrs. Tasneem Mistry** cordially request the honour of your presence at the Wedding Reception of their beloved son **Abbas** with **Naqiyah** (Daughter of Mr. Moiz Shamim & Mrs. Ashrafunnisa). Parentage cards follow on celadon mist, groom first |
| 4 | `ReceptionSection.jsx` | One featured grand card on the deep **moss night** vignette (`#2B352E → #1F2621`) framed with champagne stardust and gold filigree — `Event · The Wedding Reception` · `Saturday, 19 December 2026` · `11 Shehre Rajabul Asab 1448 (Eve)` · `8:00 PM onwards · Followed by Dinner` · `Dhawan Celebrations, Gorewada Ring Road, Nagpur`. Pointer/touch 3D tracking with radial gold sheen, Get Directions (Apple Maps on iOS, Google elsewhere), Add to Calendar (Google link + `.ics`), QR navigation |
| 5 | `VenuesSection.jsx` / `VenueCard.jsx` | Single venue. Minimal architectural vector map grid in sage & gold with a pulsing gold pin, geocoded address, copy-to-clipboard, QR |
| 6 | `VerseSection.jsx` | Soft celadon-mist arch on pearl silk, dashed gold border, champagne halo. Surah Ar-Rum 30:21 in Arabic calligraphy + English translation |
| 7 | `ClosingSection.jsx` | "With Best Compliments From" — the Mistry family elders, relatives & friends. Live countdown (days / hours / minutes / **seconds**) to `2026-12-19T20:00:00+05:30`. Native Web Share API with clipboard fallback. Keepsake trigger |

## 3. Technical architecture

- **Smooth scroll & animation.** Lenis 1.3 singleton bridged to `gsap.ticker` and `ScrollTrigger` (`src/lib/smoothScroll.js`). Framer Motion handles entrance choreography and modal lifecycles. On touch devices Lenis steps aside so native momentum scrolling and pinch-zoom are preserved.
- **Audio & haptics.** `playWaxSnap()` in `EnvelopeCeremony.jsx` synthesises the fracture from three layers — band-swept noise transient, sealing-wax body thud, hairline tick — entirely in the Web Audio API. No audio file. Haptics via `navigator.vibrate([15, 25, 15])`. Ambient Sufiyana oud starts on the first user gesture.
- **3D spatial environment.** `Spatial3DMotionCanvas.jsx` lazily initialises only after Act 0, clamps `devicePixelRatio ≤ 2`, pauses its loop on `visibilitychange`, and lerps a per-stage light grading (linen → moss → sage → mist → champagne). Objects are deliberately pushed to the frame edges and shrunk on phones — the content column spans nearly the full width there, so anything central competes with the invitation text.
- **Stage machine.** `useScrollStage.js` is scroll-position based with a 140 ms dwell, mapping sections to a single-dip arc: `linen → moss (reception) → sage → mist → champagne`. Drives the nav's active section and the 3D grading.
- **Scroll choreography.** `src/lib/scrollChoreography.js` interpolates the backdrop *continuously* rather than snapping between fixed stage plates. Each stage anchors to a section and **holds** across the first 68% of that section's height, then blends into the next stage over roughly the last 0.9 viewport before it arrives. The blend uses smoothstep and writes `--bg-a/-b/-c`, `--bg-x/-y`, `--stage-glow`, `--stage-vignette`, `--wash-opacity`, `--scroll-velocity` and per-element `--py` onto `<html>` from one rAF loop — no React re-render per frame.
- **Background engine.** `PhaseBackgroundEngine.jsx` paints a single `.live-bg` gradient from those variables, plus the celadon wash, a crown glow that breathes with scroll velocity, the stardust field and a stage-aware vignette. A DPR-clamped gold mote canvas sits on top.
- **⚠ Stacking rule.** `<body>` must stay **transparent**. An in-flow block's background paints in the same layer group as stepped content, *above* negative z-index children — so a `bg-*` class on `<body>` silently occludes the entire `-z-30` background engine. The page colour lives on `html`, which is propagated to the canvas and painted beneath everything.
- **Responsive.** Phone-first (`max-w-xl mx-auto`) scaling to centred desktop card frames.

## 4. Layer stack

`-z-30 PhaseBackgroundEngine` → `-z-10 paper / jali textures` → `z-0 three.js` → `z-10 content` → `z-20 stardust` → `z-40 HeaderNav` → `z-50 AudioPlayer / modals` → `z-[60] EnvelopeCeremony`

## 5. Content source of truth

Verbatim from the client card: names, tagline, host names, parentage, `11 Shehre Rajabul Asab 1448 (Eve)`, `8:00 PM onwards · Followed by Dinner`, `Dhawan Celebrations, Gorewada Ring Road, Nagpur`, the Fatimid dua, and Surah Ar-Rum 30:21. **Presentation and motion only — no content edits.**

## 6. File map

```
src/
  App.jsx                         act composition, theme-color, modal scroll lock
  hooks/useScrollStage.js         stage machine + nav section (dwell-debounced)
  lib/smoothScroll.js             Lenis singleton + GSAP ticker bridge
  lib/scrollChoreography.js       continuous scroll-linked colour & depth (CSS vars)
  utils/calendar.js               RECEPTION_EVENT + Google Calendar + .ics
  utils/qrGenerator.js            styled ink / antique-gold QR SVG
  utils/fullscreen.js             cross-browser fullscreen
  components/
    EnvelopeCeremony.jsx          Act 0  (+ playWaxSnap)
    GoldBurstCanvas.jsx           wax shards + gold foil burst
    GoldMonogram.jsx              A✦N mark (pure type + ornament)
    InvocationSection.jsx         Act 1
    HeroSection.jsx               Act 2
    LineageSection.jsx            Act 3
    ReceptionSection.jsx          Act 4
    VenuesSection.jsx / VenueCard.jsx   Act 5
    VerseSection.jsx              Act 6
    ClosingSection.jsx            Act 7
    KeepsakeModal.jsx             screenshot-ready keepsake card
    QrCodeModal.jsx               venue QR navigation
    HeaderNav.jsx                 floating quick-jump dock
    AudioPlayer.jsx               ambient oud + fullscreen controls
    PhaseBackgroundEngine.jsx     stage backdrop + stardust
    StardustRainfall.jsx          velocity-reactive gold motes
    Spatial3DMotionCanvas.jsx     three.js rings, ribbon, polyhedra, flecks
```

## 7. Known follow-up

`public/og/og_image.jpg` is still the bride's pastel share card. It should be replaced with a 1200×630 share image in the celadon-sage and champagne-linen palette so WhatsApp and social previews match the new aesthetic.
