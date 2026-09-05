import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Providers } from './providers';
import './globals.css';

const SITE_URL = 'https://baoansport.vn';
const SITE_NAME = 'Bảo An Sport';
const DEFAULT_TITLE = 'Bảo An Sport — Dụng Cụ Thể Thao Chính Hãng Giá Tốt Nhất';
const DEFAULT_DESC =
  'Bảo An Sport chuyên cung cấp dụng cụ thể thao, thiết bị thể dục và thể hình. Máy chạy bộ, xe đạp tập, giàn tạ đa năng, dụng cụ võ thuật, bóng bàn, bóng rổ. Sản phẩm đa dạng, giá tốt, giao hàng toàn quốc. Hotline: 0939 987 456.';

export const viewport: Viewport = {
  themeColor: '#059669',
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
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/images/favicon.png',
    shortcut: '/images/favicon.png',
    apple: '/images/favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESC,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=85',
        width: 1200,
        height: 630,
        alt: 'Bảo An Sport — Dụng Cụ Thể Thao Chính Hãng Giá Tốt Nhất',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESC,
    images: ['https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=85'],
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

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/images/logo.png`,
        description: DEFAULT_DESC,
        telephone: '+84939987456',
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+84939987456',
            contactType: 'customer service',
            areaServed: 'VN',
            availableLanguage: ['Vietnamese', 'English'],
          },
        ],
        address: {
          '@type': 'PostalAddress',
          streetAddress: '234 Định Công, Hoàng Mai',
          addressLocality: 'Hà Nội',
          addressCountry: 'VN',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: DEFAULT_DESC,
        publisher: {
          '@id': `${SITE_URL}/#organization`,
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
        inLanguage: 'vi-VN',
      },
    ],
  };

  return (
    <html lang="vi">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
