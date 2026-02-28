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
      keyframes: {},
      animation: {},
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace']
      }
    }
  },
  plugins: []
};

export default config;
