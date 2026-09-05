import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Providers } from './providers';
import './globals.css';

const SITE_URL = 'https://dctdsport.vn';
const SITE_NAME = 'DCTD Sport';
const DEFAULT_TITLE = 'DCTD Sport — Dụng Cụ Thể Thao & Thiết Bị Gym Chính Hãng';
const DEFAULT_DESC =
  'Hệ thống phân phối thiết bị gym, giàn tạ đa năng, máy chạy bộ gia đình, tạ tay và phụ kiện thể thao chính hãng. Tư vấn bản vẽ 3D và lắp đặt phòng tập Home Gym miễn phí toàn quốc.';

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
    'dụng cụ thể dục',
    'bảo an sport',
    'thiết bị gym',
    'giàn tạ đa năng',
    'máy chạy bộ gia đình',
    'ghế tập tạ',
    'tạ tay tháo lắp',
    'setup home gym',
    'dụng cụ thể thao',
    'dctd sport',
  ],
  authors: [{ name: 'DCTD Sport Việt Nam' }],
  creator: 'DCTD Sport',
  publisher: 'CTCP DCTD Sport Việt Nam',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
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
        alt: 'DCTD Sport — Thiết bị thể thao chuẩn vận động viên',
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
        logo: `${SITE_URL}/icon.svg`,
        description: DEFAULT_DESC,
        telephone: '18000000',
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '18000000',
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
