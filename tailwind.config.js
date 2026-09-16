/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm Pearl Silk — canvas, cards and body copy
        ivory: {
          DEFAULT: '#FAF7F2',
          soft: '#FDFCF9',
          card: '#F4EFE6',
          border: '#E8DFD1',
          deep: '#F1EBE1',
        },
        // Muted Celadon Sage — the primary accent
        sage: {
          DEFAULT: '#93A899',
          light: '#DDE6DE',
          mist: '#EEF3EF',
          deep: '#5E7465',
          ink: '#46584B',
        },
        // Honey Champagne & Antique Gold Foil
        gold: {
          DEFAULT: '#C7A86B',
          hairline: '#C7A86B',
          bright: '#E5D3A3',
          pale: '#F7EED8',
          burnished: '#9E8043',
          deep: '#7A6231',
        },
        // Warm Roast Espresso — never harsh black
        ink: {
          DEFAULT: '#322723',
          soft: '#544641',
          muted: '#7A6B65',
          hair: '#A99C94',
        },
        // Deep Moss / Espresso — reserved for the reception night
        moss: {
          DEFAULT: '#2B352E',
          deep: '#1F2621',
          soft: '#3A463B',
          light: '#4A584B',
        },
      },
      transitionDuration: {
        '1600': '1600ms',
        '1800': '1800ms',
        '2000': '2000ms',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Fraunces', 'serif'],
        display: ['Cormorant Garamond', 'serif'],
        calligraphy: ['"Allura"', '"Alex Brush"', '"Great Vibes"', 'cursive'],
        script: ['"Alex Brush"', '"Allura"', '"Great Vibes"', 'cursive'],
        body: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        arabic: ['Amiri', 'Noto Naskh Arabic', 'serif'],
      },
      boxShadow: {
        'silk-float': '0 18px 45px -22px rgba(50, 39, 35, 0.18)',
        'card-soft': '0 10px 30px -18px rgba(50, 39, 35, 0.22)',
        'gold-glow': '0 0 34px -8px rgba(199, 168, 107, 0.5)',
        'gold-halo': '0 0 60px -14px rgba(229, 211, 163, 0.6)',
        'gold-inset': 'inset 0 1px 0 rgba(253, 252, 249, 0.7), inset 0 -1px 0 rgba(50, 39, 35, 0.08)',
        'moss-float': '0 24px 60px -22px rgba(31, 38, 33, 0.55)',
        'jade-glow': '0 14px 34px -12px rgba(94, 116, 101, 0.55)',
      },
      animation: {
        'spin-slow': 'spin 24s linear infinite',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'pin-pulse': 'pinPulse 2.4s ease-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pinPulse: {
          '0%': { transform: 'scale(0.55)', opacity: '0.8' },
          '80%, 100%': { transform: 'scale(2.3)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
