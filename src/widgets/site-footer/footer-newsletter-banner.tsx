import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';
import {
  BANNER_DEFAULT_CTA_TEXT,
  BannerPicture,
  BannerPlacement,
  loadActiveBanners,
  type BannerView,
} from '@/features/content';
import { NewsletterForm } from '@/widgets/newsletter-form/newsletter-form';

/** Dải banner FOOTER ngay trên khối nhận tin; chỉ lấy banner đầu (API đã sắp theo `sortOrder`). */
function FooterBannerStrip({ banner }: { banner: BannerView }) {
  const hasText = Boolean(banner.title || banner.subtitle);
  const frame =
    'group relative mx-auto block aspect-[16/9] max-w-7xl overflow-hidden rounded-[28px] bg-slate-900 shadow-md sm:aspect-[5/1]';
  const body = (
    <>
      <BannerPicture
        banner={banner}
        alt=""
        sizes="(max-width: 1280px) 100vw, 1280px"
        className="object-cover object-center"
      />
      {hasText && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-6 py-6 text-white sm:px-10">
            <div className="max-w-xl">
              {banner.title && (
                <h2 className="line-clamp-2 text-xl font-black leading-tight sm:text-2xl">
                  {banner.title}
                </h2>
              )}
              {banner.subtitle && (
                <p className="mt-2 line-clamp-2 text-xs text-slate-300 sm:text-sm">
                  {banner.subtitle}
                </p>
              )}
              {banner.targetUrl && (
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 group-hover:underline sm:text-sm">
                  {banner.ctaText ?? BANNER_DEFAULT_CTA_TEXT}
                  <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
  return (
    <div className="bg-slate-900 px-4 pt-10 sm:px-6 lg:px-8">
      {banner.targetUrl ? (
        <Link
          href={banner.targetUrl}
          className={frame}
          aria-label={hasText ? undefined : (banner.ctaText ?? BANNER_DEFAULT_CTA_TEXT)}
        >
          {body}
        </Link>
      ) : (
        <div className={frame}>{body}</div>
      )}
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
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 px-6 py-10 sm:py-12 text-white border-t border-slate-800 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Mail className="size-6" />
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
          <p className="mt-3 text-xs text-slate-500">
            Chúng tôi cam kết bảo mật thông tin. Bạn có thể hủy nhận tin bất cứ lúc nào.
          </p>
        </div>
      </section>
    </>
  );
}
