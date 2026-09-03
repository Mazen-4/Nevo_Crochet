const config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        cairo: ['var(--font-cairo)', 'system-ui', 'sans-serif'],
        almarai: ['var(--font-almarai)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-geist)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        arabic: '0.4px',
        'arabic-tight': '0.2px',
        'arabic-loose': '0.6px',
      },
      lineHeight: {
        arabic: '1.85',
        'arabic-relaxed': '1.95',
      },
    },
  },
};

export default config;