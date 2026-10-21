/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cosmic: {
          950: '#060714', 900: '#0B0D21', 800: '#141738', 700: '#1F2454',
          gold: '#FFD700', amber: '#F59E0B', saffron: '#FF6F00', rudraksha: '#8B4513',
          emerald: '#10B981', celestial: '#38BDF8', amethyst: '#A855F7'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Noto Sans Devanagari', 'Noto Sans Oriya', 'sans-serif'],
        serif: ['Rozha One', 'serif']
      },
      animation: {
        'spin-slow': 'spin 40s linear infinite',
        'spin-slower': 'spin 90s linear infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'cosmic-float': 'cosmicFloat 7s ease-in-out infinite',
        'cosmic-twinkle': 'cosmicTwinkle 3s ease-in-out infinite',
        'cosmic-drift': 'cosmicDrift 18s ease-in-out infinite alternate',
        'cosmic-drift-slow': 'cosmicDrift 28s ease-in-out infinite alternate-reverse',
        'cosmic-marquee': 'cosmicMarquee 30s linear infinite',
        'cosmic-rise': 'cosmicRise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
      keyframes: {
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
        cosmicFloat: { '0%, 100%': { transform: 'translateY(0px) rotateX(6deg)' }, '50%': { transform: 'translateY(-12px) rotateX(-6deg)' } },
        cosmicTwinkle: { '0%, 100%': { opacity: '0.25', transform: 'scale(0.9)' }, '50%': { opacity: '1', transform: 'scale(1.15)' } },
        cosmicDrift: { '0%': { transform: 'translate(0, 0) scale(1)' }, '100%': { transform: 'translate(60px, -40px) scale(1.15)' } },
        cosmicMarquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        cosmicRise: { '0%': { opacity: '0', transform: 'translateY(22px) scale(0.98)' }, '100%': { opacity: '1', transform: 'translateY(0) scale(1)' } },
      }
    },
  },
  plugins: [],
}