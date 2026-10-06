import type { ReactNode } from 'react';
import { SiteHeader, type MegaMenuEntry } from '@/widgets/site-header/site-header';
import { SiteFooter } from '@/widgets/site-footer/site-footer';
import { FooterNewsletterBanner } from '@/widgets/site-footer/footer-newsletter-banner';
import { FloatingContactBar } from '@/widgets/floating-contact-bar/floating-contact-bar';
import { AssistantChat } from '@/widgets/assistant-chat/assistant-chat';

/** Đích của skip link; trang con tự render `<main>` nên vỏ chỉ là `div` (tránh `<main>` lồng nhau). */
const CONTENT_ANCHOR_ID = 'noi-dung-chinh';

export function StorefrontLayout({
  children,
  categories,
}: {
  children: ReactNode;
  /** Danh mục từ server cho mega-menu và cột "Sản phẩm nổi bật" ở footer; thiếu thì widget tự xử lý. */
  categories?: MegaMenuEntry[];
}) {
  return (
    <div className="min-h-screen">
      <a
        href={`#${CONTENT_ANCHOR_ID}`}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-brand-700 focus:shadow-lg"
      >
        Bỏ qua tới nội dung
      </a>
      <SiteHeader initialCategories={categories} />
      <div id={CONTENT_ANCHOR_ID} tabIndex={-1} className="outline-none">
        {children}
      </div>
      <FooterNewsletterBanner />
      <SiteFooter categories={categories} />
      <FloatingContactBar />
      <AssistantChat />
    </div>
  );
}
