import { PromoBanner } from '@/foundation/components/structure';
import { BANNER_DEFAULT_CTA_TEXT, type BannerView } from '../model/banner.mapper';
import { BannerPicture } from './banner-picture';

const FRAME =
  'group relative block aspect-[16/9] overflow-hidden rounded-[28px] bg-slate-900 shadow-md sm:aspect-[4/1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2';

/** Banner CATEGORY_TOP phía trên lưới sản phẩm; không có banner thì không render gì. */
export function CategoryTopBanners({ banners }: { banners: BannerView[] }) {
  if (banners.length === 0) return null;
  return (
    <div className="mt-8 grid gap-4">
      {banners.map((banner) => (
        <PromoBanner
          key={banner.id}
          href={banner.targetUrl}
          title={banner.title}
          subtitle={banner.subtitle}
          ctaLabel={banner.ctaText ?? BANNER_DEFAULT_CTA_TEXT}
          className={FRAME}
          media={
            <BannerPicture
              banner={banner}
              alt=""
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-center"
            />
          }
        />
      ))}
    </div>
  );
}
