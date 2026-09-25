'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProductGalleryImageView } from '../model/product.mapper';

/**
 * Ảnh chính + dải ảnh nhỏ của trang chi tiết.
 *
 * Bản trước render ảnh nhỏ thành `<a target="_blank">` tới ảnh gốc: bấm vào mở tab mới
 * (khách tưởng bị đá ra khỏi trang) còn ảnh lớn vẫn đứng yên. Ảnh nhỏ giờ là nút chọn ảnh
 * hiển thị ở khung chính, và có cả ảnh đầu tiên để quay lại được.
 */
export function ProductImageGallery({
  images,
  productName,
}: {
  images: ProductGalleryImageView[];
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];
  const hasMany = images.length > 1;
  const step = (delta: number) =>
    setActiveIndex((current) => (current + delta + images.length) % images.length);

  if (!active) return null;

  return (
    <>
      <div className="relative aspect-[4/3] bg-gradient-to-br from-white to-[var(--dc-primary-50)] sm:aspect-[16/11]">
        <Image
          key={active.url}
          src={active.url}
          alt={active.alt}
          fill
          priority={activeIndex === 0}
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="object-contain p-4 sm:p-8"
        />
        {hasMany && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              className="absolute left-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-700 shadow transition hover:bg-white"
              aria-label="Ảnh trước"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-700 shadow transition hover:bg-white"
              aria-label="Ảnh sau"
            >
              <ChevronRight className="size-5" />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-slate-900/70 px-2.5 py-1 text-[11px] font-bold text-white">
              {activeIndex + 1}/{images.length}
            </span>
          </>
        )}
      </div>
      {hasMany && (
        <ul className="grid grid-cols-4 gap-2 border-t border-[var(--dc-border)] p-3 sm:grid-cols-6 sm:gap-3 sm:p-4">
          {images.map((image, index) => {
            const selected = index === activeIndex;
            return (
              <li key={image.id} className="min-w-0">
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Xem ảnh ${index + 1} của ${productName}`}
                  aria-current={selected ? 'true' : undefined}
                  className={`relative block aspect-square w-full overflow-hidden rounded-xl border-2 bg-white transition ${
                    selected
                      ? 'border-[var(--dc-primary-500)]'
                      : 'border-[var(--dc-border)] hover:border-[var(--dc-primary-300)]'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 640px) 25vw, (max-width: 1024px) 16vw, 110px"
                    className="object-contain p-1.5"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
