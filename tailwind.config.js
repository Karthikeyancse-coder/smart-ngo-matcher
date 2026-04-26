/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        nx: {
          bg: {
            base: 'var(--color-bg-base)',
            surface: 'var(--color-bg-surface)',
            card: 'var(--color-bg-card)',
            elevated: 'var(--color-bg-elevated)',
            overlay: 'var(--color-bg-overlay)',
          },
          border: {
            subtle: 'var(--color-border-subtle)',
            default: 'var(--color-border-default)',
            strong: 'var(--color-border-strong)',
          },
          text: {
            primary: 'var(--color-text-primary)',
            secondary: 'var(--color-text-secondary)',
            tertiary: 'var(--color-text-tertiary)',
            disabled: 'var(--color-text-disabled)',
          },
          accent: {
            primary: 'var(--color-accent-primary)',
            hover: 'var(--color-accent-hover)',
            subtle: 'var(--color-accent-subtle)',
          },
          cyan: {
            DEFAULT: 'var(--color-cyan)',
            subtle: 'var(--color-cyan-subtle)',
          },
          amber: {
            DEFAULT: 'var(--color-amber)',
            subtle: 'var(--color-amber-subtle)',
          },
          crimson: {
            DEFAULT: 'var(--color-crimson)',
            subtle: 'var(--color-crimson-subtle)',
          },
          green: {
            DEFAULT: 'var(--color-green)',
            subtle: 'var(--color-green-subtle)',
          },
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        modal: 'var(--shadow-modal)',
        glow: 'var(--shadow-glow)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
