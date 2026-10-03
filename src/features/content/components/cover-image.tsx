'use client';

import { useState } from 'react';
import Image, { type ImageProps } from 'next/image';
import { PRODUCT_PLACEHOLDER_IMAGE } from '@/shared/constants';

type CoverImageProps = Omit<ImageProps, 'src' | 'onError'> & { src: string | null | undefined };

/**
 * Ảnh bìa bài viết: URL rỗng hoặc tải lỗi (ảnh bị xoá khỏi Cloudinary, host chết) thì hiện ảnh thay thế dùng chung
 * thay cho khung vỡ. Ảnh tải được thì hiển thị y như `next/image`.
 */
export function CoverImage({ src, alt, ...props }: CoverImageProps) {
  // Nhớ URL đã lỗi thay vì cờ boolean: đổi sang bài khác (src mới) thì thử tải lại.
  const [failedSrc, setFailedSrc] = useState<string>();
  const broken = !src || failedSrc === src;
  return (
    <Image
      {...props}
      alt={alt}
      src={broken ? PRODUCT_PLACEHOLDER_IMAGE : src}
      onError={() => {
        if (src) setFailedSrc(src);
      }}
    />
  );
}
