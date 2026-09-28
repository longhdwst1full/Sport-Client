import type { ReactNode } from 'react';
import { SiteHeader } from '@/widgets/site-header/site-header';
import { SiteFooter } from '@/widgets/site-footer/site-footer';
import { FooterNewsletterBanner } from '@/widgets/site-footer/footer-newsletter-banner';
import { FloatingContactBar } from '@/widgets/floating-contact-bar/floating-contact-bar';

export function StorefrontLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>{children}</main>
      <FooterNewsletterBanner />
      <SiteFooter />
      <FloatingContactBar />
    </div>
  );
}
