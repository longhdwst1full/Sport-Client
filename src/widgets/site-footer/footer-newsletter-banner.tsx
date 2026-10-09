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
      <section className="border-t border-neutral-800 bg-neutral-900 px-4 py-10 text-white sm:py-12 lg:px-10">
        <div className="page-container flex flex-col items-center gap-6 px-0 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">Cần tư vấn chọn thiết bị?</h2>
            <p className="mt-1.5 text-sm text-neutral-300">
              Nhân viên {STORE_CONFIG.name} hỗ trợ {STORE_CONTACT.openingHoursShort}.
            </p>
          </div>
          <ContactActions tone="dark" className="justify-center" />
        </div>
      </section>
    </>
  );
}
