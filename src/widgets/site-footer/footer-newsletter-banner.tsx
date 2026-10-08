import { Mail } from 'lucide-react';
import {
  BANNER_DEFAULT_CTA_TEXT,
  BannerPicture,
  BannerPlacement,
  loadActiveBanners,
  type BannerView,
} from '@/features/content';
import { PromoBanner } from '@/foundation/components/structure';
import { NewsletterForm } from '@/widgets/newsletter-form/newsletter-form';

/** Dải banner FOOTER ngay trên khối nhận tin; chỉ lấy banner đầu (API đã sắp theo `sortOrder`). */
function FooterBannerStrip({ banner }: { banner: BannerView }) {
  return (
    <div className="bg-slate-900 px-4 pt-10 sm:px-6 lg:px-8">
      <PromoBanner
        href={banner.targetUrl}
        title={banner.title}
        subtitle={banner.subtitle}
        ctaLabel={banner.ctaText ?? BANNER_DEFAULT_CTA_TEXT}
        className="group relative mx-auto block aspect-[16/9] max-w-7xl overflow-hidden rounded-2xl bg-slate-900 shadow-md sm:aspect-[5/1]"
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
 * Server component trong layout storefront (ISR 300s đặt ở `app/(storefront)/layout.tsx`).
 * Có banner FOOTER thì thêm dải banner phía trên; khối nhận tin giữ nguyên trong mọi trường hợp
 * (banner là quảng bá, không thay chức năng đăng ký email). Không có banner: giao diện như cũ.
 */
export async function FooterNewsletterBanner() {
  const [footerBanner] = await loadActiveBanners(BannerPlacement.FOOTER);
  return (
    <>
      {footerBanner && <FooterBannerStrip banner={footerBanner} />}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0c1222] via-[#090e1a] to-[#060912] px-4 py-12 sm:py-16 text-white border-t border-slate-800/80 lg:px-10">
        {/* Subtle Top Red Ambient Glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-px w-3/4 max-w-4xl bg-gradient-to-r from-transparent via-red-500/35 to-transparent" />
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 size-80 rounded-full bg-red-600/10 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500/20 to-rose-600/10 border border-red-500/30 text-red-400 shadow-lg shadow-red-500/10">
            <Mail aria-hidden className="size-6 text-red-400" />
          </div>
          <h2 className="mt-5 text-2xl font-black sm:text-3xl text-white">
            Nhận ưu đãi độc quyền & kiến thức thể thao
          </h2>
          <p className="mt-2.5 text-sm text-slate-300 sm:text-base">
            Đăng ký email để nhận thông tin sản phẩm mới, combo thiết bị giảm giá và bài viết hướng
            dẫn tập luyện từ HLV.
          </p>
          <div className="mt-6">
            <NewsletterForm />
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Chúng tôi cam kết bảo mật thông tin. Bạn có thể hủy nhận tin bất cứ lúc nào.
          </p>
        </div>
      </section>
    </>
  );
}
