/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Static palette fallbacks. Live values are driven by CSS variables
        // (see index.css + theme.js) so the admin panel can recolor the whole
        // site without a redeploy.
        void: 'rgb(var(--c-bg) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        muted: 'rgb(var(--c-muted) / <alpha-value>)',
        primary: 'rgb(var(--c-primary) / <alpha-value>)',
        secondary: 'rgb(var(--c-secondary) / <alpha-value>)',
        accent: 'rgb(var(--c-accent) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Fluid, controlled type scale (base unit: 8px rhythm elsewhere)
        'display-xl': ['clamp(3rem, 2.1rem + 4vw, 5rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(2.25rem, 1.8rem + 2vw, 2.75rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(1.25rem, 1.1rem + 0.6vw, 1.375rem)', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        label: ['0.8125rem', { lineHeight: '1.4', letterSpacing: '0.18em' }],
      },
      maxWidth: {
        content: '1200px',
      },
      spacing: {
        18: '4.5rem',
      },
      keyframes: {
        'grid-pan': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '40px 40px' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'mesh-drift': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(3%, -4%) scale(1.05)' },
          '66%': { transform: 'translate(-2%, 3%) scale(0.97)' },
        },
        'count-fade': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      animation: {
        'grid-pan': 'grid-pan 8s linear infinite',
        'mesh-drift': 'mesh-drift 22s ease-in-out infinite',
        'mesh-drift-slow': 'mesh-drift 32s ease-in-out infinite reverse',
      },
    },
  },
  plugins: [],
}
