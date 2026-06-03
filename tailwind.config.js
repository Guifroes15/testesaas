/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'brand-dark':        'var(--brand-dark)',
        'brand-medium':      'var(--brand-medium)',
        'brand-light':       'var(--brand-light)',
        'brand-purple':      '#22c55e',
        'brand-purple2':     '#4ade80',
        'brand-accent':      '#22c55e',
        'gray-650':          '#515e73',
        'gray-850':          '#1a1f2e',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-green': 'pulseGreen 2s infinite',
      },
      keyframes: {
        pulseGreen: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(34,197,94,0.4)' },
          '50%':      { boxShadow: '0 0 0 8px rgba(34,197,94,0)' },
        },
      },
      boxShadow: {
        'green-glow':    '0 0 20px rgba(34,197,94,0.25)',
        'green-glow-lg': '0 0 40px rgba(34,197,94,0.3)',
        'purple-glow':   '0 0 20px rgba(34,197,94,0.3)',
      },
    },
  },
  plugins: [],
}
