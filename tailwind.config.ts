import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './src/**/*.{vue,js,ts}'
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#dbfcff",
        "on-primary": "#00363a",
        "secondary": "#dcb8ff",
        "on-secondary": "#480081",
        "tertiary": "#fff3f6",
        "error": "#ffb4ab",
        "surface": "var(--surface)",
        "background": "var(--bg-color)",
        "on-background": "var(--on-background)",
        "on-surface": "var(--on-surface)",
        "on-surface-variant": "var(--on-surface-variant)",
        "outline-variant": "#3b494b",
        "neon-cyan": "#00f0ff",
        "deep-purple": "#7701d0",
        "glass": "rgba(255, 255, 255, 0.03)",
        "surface-container": "#201f1f",
        "surface-container-high": "#2a2a2a",
        "primary-container": "#00f0ff",
        "secondary-container": "#7701d0",
        "surface-dim": "#131313",
        "surface-container-lowest": "#0e0e0e",
        "secondary-fixed": "#efdbff",
        "tertiary-fixed-dim": "#ffaedd",
      },
      fontFamily: {
        'display': ['Space Grotesk', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      maxWidth: {
        'container-max': '1440px',
      }
    },
  },
  plugins: [],
} satisfies Config