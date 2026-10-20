import {
  BANNER_DEFAULT_CTA_TEXT,
  NewsletterSignup,
  BannerPicture,
  type BannerView,
} from '@/features/content';
import { Headphones, MailOpen } from 'lucide-react';
import { PromoBanner } from '@/foundation/components/structure';
import { ContactActions } from '@/shared/components/contact-actions';
import { STORE_CONFIG, STORE_CONTACT } from '@/shared/constants';

/** Dải banner FOOTER ngay trên khối nhận tin; chỉ lấy banner đầu (API đã sắp theo `sortOrder`). */
function FooterBannerStrip({ banner }: { banner: BannerView }) {
  return (
    <div className="bg-neutral-50 px-4 pt-10 sm:px-6 lg:px-8">
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
 * Đăng ký nhận tin đi qua API thật `createNewsletterSubscription` (`NewsletterSignup`).
 */
export function FooterNewsletterBanner({ banner: footerBanner }: { banner?: BannerView }) {
  return (
    <>
      {footerBanner && <FooterBannerStrip banner={footerBanner} />}
      {/* Nền sáng, hai thẻ: tách hẳn khỏi footer tối bên dưới (trước đây cùng gradient đen nên dính thành một khối). */}
      <section aria-label="Tư vấn và nhận tin" className="border-t border-neutral-200 bg-gradient-to-br from-brand-50/70 via-white to-neutral-50 py-10 sm:py-12">
        <div className="page-container grid gap-4 md:grid-cols-2">
          <div className="flex gap-4 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
            <span className="hidden size-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600 sm:grid" aria-hidden="true">
              <Headphones className="size-6" />
            </span>
            <div className="min-w-0">
              <h2 className="text-lg font-bold tracking-tight text-neutral-950 sm:text-xl">Cần tư vấn chọn thiết bị?</h2>
              <p className="mt-1 text-sm text-neutral-600">
                Nhân viên {STORE_CONFIG.name} tư vấn trực tiếp, hỗ trợ {STORE_CONTACT.openingHoursShort}.
              </p>
              {/* Mobile: nút giãn đều chiều ngang; từ sm trở lên co theo nội dung. */}
              <ContactActions className="mt-4 [&>*]:grow sm:[&>*]:grow-0" />
            </div>
          </div>
          <div className="flex gap-4 rounded-2xl border border-brand-100 bg-brand-50/60 p-5 sm:p-6">
            <span className="hidden size-12 shrink-0 place-items-center rounded-2xl bg-white text-brand-600 shadow-2xs sm:grid" aria-hidden="true">
              <MailOpen className="size-6" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold tracking-tight text-neutral-950 sm:text-xl">Nhận ưu đãi & bài hướng dẫn tập</h2>
              <p className="mb-4 mt-1 text-sm text-neutral-600">Email về sản phẩm mới và khuyến mãi. Huỷ đăng ký bất cứ lúc nào.</p>
              <NewsletterSignup source="footer" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
