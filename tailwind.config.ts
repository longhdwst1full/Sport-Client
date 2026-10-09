import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"SF Pro"', '-apple-system', 'BlinkMacSystemFont', 'Roboto', '"Noto Sans"', 'sans-serif'],
      },
      // Xám dùng họ `neutral` mặc định của Tailwind (trung tính như xám logo #4D4D4F). Đổi tông xám
      // toàn site: khai `neutral: {...}` tại đây — component không dùng slate/stone/gray/zinc.
      colors: {
        ink: '#171717', // neutral-900: xám than trung tính như chữ "BẢO AN" trong logo (#4D4D4F), không ngả xanh
        cream: '#fafafa', // neutral-50
        // Đỏ thương hiệu lấy đúng từ logo (#E83734, hue ~0°). Bản trước ngả đỏ thẫm/hồng (#cf222e, hue 355°)
        // nên lệch tông logo. `brand` chỉ dùng cho giá, khuyến mãi và điểm nhấn nhận diện — nút chính là `ink`.
        brand: {
          50: '#fef3f2',
          100: '#fee4e2',
          200: '#fecdca',
          300: '#fca9a4',
          400: '#f6766f',
          500: '#e83734',
          600: '#d42a27',
          700: '#b2221f',
          800: '#921f1d',
          900: '#791f1d',
          950: '#420b0a',
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
      // DESIGN TOKENS — nguồn duy nhất cho cỡ chữ nhỏ, bo góc lớn và giãn chữ nhãn. Không viết
      // `text-[11px]`, `rounded-[28px]`, `tracking-[0.2em]` trong component (`20-design-tokens.md`).
      fontSize: {
        '3xs': ['0.625rem', { lineHeight: '0.875rem' }], // 10px — badge rất nhỏ
        '2xs': ['0.6875rem', { lineHeight: '1rem' }], // 11px — metadata, helper
      },
      borderRadius: {
        '4xl': '2rem', // 32px — khối lớn (hero, banner, section nổi bật)
      },
      letterSpacing: {
        eyebrow: '0.2em', // nhãn nhỏ viết hoa trên tiêu đề khối
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
        '2xs': '0 1px rgba(23, 23, 23, 0.05)',
        xs: '0 1px 2px 0 rgba(23, 23, 23, 0.05)',
        card: '0 4px 20px -2px rgba(23, 23, 23, 0.06), 0 2px 6px -1px rgba(23, 23, 23, 0.04)',
        'card-hover': '0 20px 35px -4px rgba(23, 23, 23, 0.10), 0 10px 15px -3px rgba(23, 23, 23, 0.05)',
        soft: '0 2px 15px -3px rgba(23, 23, 23, 0.07)',
        glow: '0 0 25px -5px rgba(23, 23, 23, 0.25)',
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
