/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Saira Stencil One"', 'sans-serif'],
        heading: ['"Outfit"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        cyber: {
          bg:      '#040609',
          surface: '#080D16',
          card:    '#0B1120',
          cyan:    '#00F0FF',
          orange:  '#FF4D00',
          purple:  '#8B5CF6',
          gold:    '#FFD600',
          text:    '#EEF2FF',
          muted:   '#5A6A8A',
        },
      },
      animation: {
        'fade-up':    'fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        'scale-in':   'scaleIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-in':   'slideIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'scan':       'scan 8s linear infinite',
      },
      keyframes: {
        fadeUp:    { from: { opacity:'0', transform:'translateY(28px)' }, to: { opacity:'1', transform:'translateY(0)' } },
        scaleIn:   { from: { opacity:'0', transform:'scale(0.92) translateY(10px)' }, to: { opacity:'1', transform:'scale(1) translateY(0)' } },
        slideIn:   { from: { opacity:'0', transform:'translateX(-14px)' }, to: { opacity:'1', transform:'translateX(0)' } },
        glowPulse: {
          '0%,100%': { opacity:'0.5' },
          '50%':     { opacity:'1' },
        },
        scan: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
      boxShadow: {
        'glow-cyan':   '0 0 20px rgba(0,240,255,0.25), 0 0 60px rgba(0,240,255,0.08)',
        'glow-orange': '0 0 20px rgba(255,77,0,0.3), 0 0 60px rgba(255,77,0,0.1)',
        'glow-purple': '0 0 20px rgba(139,92,246,0.3)',
        'card':        '0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
        'card-hover':  '0 12px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
      },
    },
  },
  plugins: [],
};
