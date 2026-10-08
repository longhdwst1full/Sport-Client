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
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 px-4 py-10 sm:py-12 text-white border-t border-slate-800 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-900/10 border border-slate-900/20 text-slate-300">
            <Mail aria-hidden className="size-6" />
          </div>
          <h2 className="mt-5 text-2xl font-black sm:text-3xl text-white">
            Nhận ưu đãi độc quyền & kiến thức thể thao
          </h2>
          <p className="mt-2.5 text-sm text-slate-400 sm:text-base">
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
