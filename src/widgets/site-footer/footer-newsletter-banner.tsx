import {
  BANNER_DEFAULT_CTA_TEXT,
  BannerPicture,
  type BannerView,
} from '@/features/content';
import { PromoBanner } from '@/foundation/components/structure';
import { ContactActions } from '@/shared/components/contact-actions';
import { STORE_CONFIG, STORE_CONTACT } from '@/shared/constants';

/** Dải banner FOOTER ngay trên khối nhận tin; chỉ lấy banner đầu (API đã sắp theo `sortOrder`). */
function FooterBannerStrip({ banner }: { banner: BannerView }) {
  return (
    <div className="bg-neutral-900 px-4 pt-10 sm:px-6 lg:px-8">
      <PromoBanner
        href={banner.targetUrl}
        title={banner.title}
        subtitle={banner.subtitle}
        ctaLabel={banner.ctaText ?? BANNER_DEFAULT_CTA_TEXT}
        className="group relative mx-auto block aspect-[16/9] max-w-7xl overflow-hidden rounded-2xl bg-neutral-900 shadow-md sm:aspect-[5/1]"
        media={
          <BannerPicture
            banner={banner}
            alt=""
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-center"
          />
        }
      />
    </div>
  );
}

/**
 * Dải cuối trang trong layout storefront: banner FOOTER (nếu Admin bật) + khối liên hệ tư vấn.
 *
 * GAP: trước đây là form "nhận tin qua email" nhưng contract Storefront chưa có API newsletter nên
 * form không gửi đi đâu (RULE-TRUST-03). Thay bằng các kênh liên hệ có thật; có endpoint thì thêm lại.
 */
export function FooterNewsletterBanner({ banner: footerBanner }: { banner?: BannerView }) {
  return (
    <>
      {footerBanner && <FooterBannerStrip banner={footerBanner} />}
      <section className="relative overflow-hidden border-t border-red-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-red-950/80 px-4 py-10 text-white sm:py-12 lg:px-10 shadow-xl">
        <div className="pointer-events-none absolute -left-12 -top-12 size-56 rounded-full bg-red-600/20 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

        <div className="relative z-10 page-container flex flex-col items-center gap-6 px-0 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <h2 className="text-xl font-black sm:text-2xl lg:text-3xl text-white tracking-tight">
              Cần tư vấn chọn thiết bị?
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm font-medium text-slate-300">
              Nhân viên {STORE_CONFIG.name} tư vấn trực tiếp 1:1, hỗ trợ {STORE_CONTACT.openingHoursShort}.
            </p>
          </div>
          <ContactActions tone="dark" className="justify-center" />
        </div>
      </section>
    </>
  );
}
