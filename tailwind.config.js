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
        'brand-purple':      '#7c3aed',
        'brand-purple2':     '#a78bfa',
        'brand-accent':      '#7c3aed',
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
        'purple-glow':   '0 0 20px rgba(124,58,237,0.3)',
      },
    },
  },
  plugins: [],
}
