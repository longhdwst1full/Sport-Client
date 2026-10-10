import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Be_Vietnam_Pro } from 'next/font/google';
import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/seo/page-metadata';
import { ORGANIZATION_ID, serializeJsonLd, WEBSITE_ID } from '@/lib/seo/json-ld';
import { STORE_CONFIG, STORE_CONTACT, STORE_SHOWROOMS } from '@/shared/constants';
import { Providers } from './providers';
import './globals.css';

/**
 * Be Vietnam Pro: thiết kế cho tiếng Việt, tự host lúc build (không gọi Google lúc chạy) và preload.
 * Chỉ 4 độ đậm: tiêu đề 700, nhãn/nút 600, nhấn nhẹ 500, thân bài 400 (`20-design-tokens.md`).
 */
const fontSans = Be_Vietnam_Pro({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
});

const DEFAULT_TITLE = 'Bảo An Sport — Dụng Cụ Thể Thao Chính Hãng Giá Tốt Nhất';
const DEFAULT_DESC =
  'Dụng cụ thể thao, thiết bị thể hình chính hãng: máy chạy bộ, xe đạp tập, giàn tạ, bóng bàn, võ thuật. Giao và lắp đặt toàn quốc.';

export const viewport: Viewport = {
  // Trùng `theme_color` của manifest (brand-600) để thanh trạng thái không đổi màu khi mở app đã cài.
  themeColor: '#d42a27',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESC,
  keywords: [
    'bảo an sport',
    'dụng cụ thể dục',
    'dụng cụ thể thao',
    'thiết bị gym',
    'máy chạy bộ',
    'xe đạp tập thể dục',
    'giàn tạ đa năng',
    'ghế tập tạ',
    'tạ tay',
    'dụng cụ võ thuật',
    'bóng bàn',
    'bóng rổ',
    'thiết bị dạy học thể dục',
    'setup home gym',
    'baoansport',
  ],
  authors: [{ name: 'Bảo An Sport' }],
  creator: 'Bảo An Sport',
  publisher: 'Bảo An Sport',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // Không đặt `alternates.canonical` ở layout: mọi trang con kế thừa nó, tức là tự khai mình là
  // bản sao của trang chủ. Mỗi trang index được tự khai canonical (`buildPageMetadata`).
  icons: {
    icon: [
      { url: '/images/favicon.png', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/images/favicon.png',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: 'default',
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESC,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESC,
    images: [DEFAULT_OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

/** Giờ mở cửa khai trong `STORE_CONTACT.openingHours` (08:30–21:30, mọi ngày). */
const OPENING_HOURS = {
  '@type': 'OpeningHoursSpecification',
  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  opens: '08:30',
  closes: '21:30',
} as const;

/**
 * Organization + WebSite + từng showroom (SportingGoodsStore — LocalBusiness). Thông tin lấy từ
 * `STORE_CONFIG`/`STORE_CONTACT`/`STORE_SHOWROOMS` để JSON-LD không lệch với footer/trang liên hệ.
 */
const SITE_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': ORGANIZATION_ID,
      name: SITE_NAME,
      legalName: STORE_CONFIG.legalName,
      url: SITE_URL,
      logo: absoluteUrl('/images/logo.png'),
      description: DEFAULT_DESC,
      email: STORE_CONTACT.email,
      telephone: `+84${STORE_CONTACT.primaryHotlineRaw.slice(1)}`,
      foundingDate: String(STORE_CONFIG.sinceYear),
      sameAs: [STORE_CONTACT.facebookUrl, STORE_CONTACT.youtubeUrl, STORE_CONTACT.tiktokUrl],
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: `+84${STORE_CONTACT.primaryHotlineRaw.slice(1)}`,
          contactType: 'customer service',
          areaServed: 'VN',
          availableLanguage: ['Vietnamese'],
        },
      ],
    },
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      url: SITE_URL,
      name: SITE_NAME,
      description: DEFAULT_DESC,
      publisher: { '@id': ORGANIZATION_ID },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
      inLanguage: 'vi-VN',
    },
    ...STORE_SHOWROOMS.map((showroom) => ({
      '@type': 'SportingGoodsStore',
      '@id': `${SITE_URL}/#store-${showroom.id}`,
      name: showroom.name,
      url: absoluteUrl('/contact'),
      image: absoluteUrl('/images/logo.png'),
      telephone: `+84${showroom.phoneRaw.slice(1)}`,
      priceRange: '₫₫',
      currenciesAccepted: 'VND',
      address: {
        '@type': 'PostalAddress',
        streetAddress: showroom.address,
        addressLocality: showroom.city,
        addressCountry: 'VN',
      },
      openingHoursSpecification: [OPENING_HOURS],
      parentOrganization: { '@id': ORGANIZATION_ID },
    })),
  ],
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="vi" className={fontSans.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(SITE_JSON_LD) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
