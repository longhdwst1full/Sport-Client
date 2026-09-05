import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#17211b',
        cream: '#f6f3ea',
        brand: {
          50: '#effbf4',
          100: '#d1f5e0',
          200: '#a6ebc5',
          300: '#6ddba2',
          400: '#34d399',
          500: '#19a15f',
          600: '#12824b',
          700: '#0f6a3e',
          800: '#0d5533',
          900: '#16432d',
        },
      },
      boxShadow: {
        card: '0 18px 50px rgba(23, 33, 27, 0.10)',
        'card-hover': '0 24px 60px rgba(23, 33, 27, 0.16)',
        soft: '0 4px 24px rgba(23, 33, 27, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      screens: {
        'xs': '375px',
        '3xl': '1680px',
      },
    },
  },
  plugins: [],
} satisfies Config;
