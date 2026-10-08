import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"SF Pro"', '-apple-system', 'BlinkMacSystemFont', 'Roboto', '"Noto Sans"', 'sans-serif'],
      },
      colors: {
        ink: '#0f172a', // Modern slate-900 instead of muddy dark green
        cream: '#f8fafc', // Modern crisp slate-50 instead of yellowish cream
        // Đỏ thương hiệu thể thao năng động, tinh tế (refined athletic ruby). `brand` = màu hành động/nhận diện.
        brand: {
          50: '#fff5f5',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#e03131',
          600: '#cf222e',
          700: '#b01c26',
          800: '#8f1820',
          900: '#72151b',
          950: '#3d0b0f',
        },
        // Trạng thái "thành công/hoàn tất/còn hàng" giữ xanh lục: không dùng đỏ thương hiệu cho nghĩa OK.
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
      },
      // Một số class viết theo cú pháp Tailwind v4 (`size-4.5`, `shadow-xs`, `backdrop-blur-xs`) không có ở v3:
      // khai thêm thang để chúng sinh CSS thay vì im lặng không có tác dụng.
      spacing: {
        4.5: '1.125rem',
        10.5: '2.625rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        '2xs': '0 1px rgba(15, 23, 42, 0.05)',
        xs: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
        card: '0 4px 20px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 20px 35px -4px rgba(15, 23, 42, 0.10), 0 10px 15px -3px rgba(15, 23, 42, 0.05)',
        soft: '0 2px 15px -3px rgba(15, 23, 42, 0.07)',
        glow: '0 0 25px -5px rgba(15, 23, 42, 0.25)',
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
