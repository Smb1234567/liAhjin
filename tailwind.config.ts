import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        "rank-e": "#6b7280",
        "rank-d": "#22c55e",
        "rank-c": "#3b82f6",
        "rank-b": "#a855f7",
        "rank-a": "#f59e0b",
        "rank-s": "#ef4444"
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(255,255,255,0.1)' },
          '50%': { boxShadow: '0 0 25px rgba(255,255,255,0.35)' }
        },
        rainbow: {
          '0%': { filter: 'hue-rotate(0deg)' },
          '100%': { filter: 'hue-rotate(360deg)' }
        },
        levelUp: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '25%': { opacity: '1', transform: 'scale(1.05)' },
          '100%': { opacity: '0', transform: 'scale(1.2)' }
        }
      },
      animation: {
        pulseGlow: 'pulseGlow 2.5s ease-in-out infinite',
        rainbow: 'rainbow 6s linear infinite',
        levelUp: 'levelUp 2.5s ease-in-out'
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace']
      }
    }
  },
  plugins: []
};

export default config;
