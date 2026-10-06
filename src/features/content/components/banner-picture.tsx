import Image, { getImageProps } from 'next/image';
import type { BannerView } from '../model/banner.mapper';

interface BannerPictureProps {
  banner: Pick<BannerView, 'desktopImageUrl' | 'mobileImageUrl'>;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

/** Breakpoint `md` của Tailwind: từ đây trở lên dùng ảnh desktop. */
const DESKTOP_MEDIA = '(min-width: 768px)';

/**
 * Ảnh banner `fill` (container cha phải `relative` + có chiều cao). Có ảnh mobile thì hiển thị nó
 * dưới `md`, ảnh desktop từ `md` trở lên; không có thì một ảnh desktop cho mọi màn hình.
 *
 * Hai ảnh dùng art direction `<picture>` + `getImageProps` (vẫn qua pipeline tối ưu của Next):
 * trình duyệt chỉ tải đúng một nguồn theo media query. Trước đây là hai `<Image priority>`, một cái
 * bị ẩn bằng CSS nhưng vẫn được preload, nên mỗi banner hero tải gấp đôi ảnh ưu tiên.
 */
export function BannerPicture({ banner, alt, sizes, priority, className = '' }: BannerPictureProps) {
  if (!banner.mobileImageUrl) {
    return <Image src={banner.desktopImageUrl} alt={alt} fill priority={priority} sizes={sizes} className={className} />;
  }

  const common = {
    alt,
    fill: true,
    priority,
    fetchPriority: priority ? ('high' as const) : undefined,
    className,
  };
  const {
    props: { srcSet: desktopSrcSet, sizes: desktopSizes },
  } = getImageProps({ ...common, src: banner.desktopImageUrl, sizes });
  const { props: mobileProps } = getImageProps({ ...common, src: banner.mobileImageUrl, sizes: '100vw' });

  return (
    <picture>
      <source media={DESKTOP_MEDIA} srcSet={desktopSrcSet} sizes={desktopSizes} />
      {/* <img> + getImageProps: mẫu art direction chính thức của Next, ảnh vẫn qua /_next/image. */}
      <img {...mobileProps} alt={alt} />
    </picture>
  );
}
