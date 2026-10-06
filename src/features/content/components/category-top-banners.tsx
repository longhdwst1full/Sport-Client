import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BANNER_DEFAULT_CTA_TEXT, type BannerView } from '../model/banner.mapper';
import { BannerPicture } from './banner-picture';

/** Banner CATEGORY_TOP phía trên lưới sản phẩm; không có banner thì không render gì. */
export function CategoryTopBanners({ banners }: { banners: BannerView[] }) {
  if (banners.length === 0) return null;
  return (
    <div className="mt-8 grid gap-4">
      {banners.map((banner) => {
        const hasText = Boolean(banner.title || banner.subtitle);
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
                      <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-brand-400 group-hover:underline sm:text-sm">
                        {banner.ctaText ?? BANNER_DEFAULT_CTA_TEXT}
                        <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden="true" />
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        );
        const frame =
          'group relative block aspect-[16/9] overflow-hidden rounded-[28px] bg-slate-900 shadow-md sm:aspect-[4/1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2';
        return banner.targetUrl ? (
          <Link
            key={banner.id}
            href={banner.targetUrl}
            className={frame}
            aria-label={hasText ? undefined : (banner.ctaText ?? BANNER_DEFAULT_CTA_TEXT)}
          >
            {body}
          </Link>
        ) : (
          <div key={banner.id} className={frame}>
            {body}
          </div>
        );
      })}
    </div>
  );
}
