import Image from 'next/image';
import type { BannerView } from '../model/banner.mapper';

interface BannerPictureProps {
  banner: Pick<BannerView, 'desktopImageUrl' | 'mobileImageUrl'>;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

/**
 * Ảnh banner `fill` (container cha phải `relative` + có chiều cao). Có ảnh mobile thì hiển thị nó
 * dưới `md`, ảnh desktop từ `md` trở lên; không có thì một ảnh desktop cho mọi màn hình.
 */
export function BannerPicture({ banner, alt, sizes, priority, className = '' }: BannerPictureProps) {
  if (!banner.mobileImageUrl) {
    return <Image src={banner.desktopImageUrl} alt={alt} fill priority={priority} sizes={sizes} className={className} />;
  }
  return (
    <>
      <Image
        src={banner.mobileImageUrl}
        alt={alt}
        fill
        priority={priority}
        sizes="100vw"
        className={`md:hidden ${className}`}
      />
      <Image
        src={banner.desktopImageUrl}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`hidden md:block ${className}`}
      />
    </>
  );
}
