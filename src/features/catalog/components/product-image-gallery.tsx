'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import type { ProductGalleryImageView } from '../model/product.mapper';

/**
 * Ảnh chính + dải ảnh nhỏ của trang chi tiết.
 * Hỗ trợ hiệu ứng phóng to theo con trỏ chuột (interactive zoom lens như Shopee).
 */
const GALLERY_ARROWS = [
  { delta: -1, label: 'Ảnh trước', side: 'left-3', Icon: ChevronLeft },
  { delta: 1, label: 'Ảnh sau', side: 'right-3', Icon: ChevronRight },
] as const;

export function ProductImageGallery({
  images,
  productName,
}: {
  images: ProductGalleryImageView[];
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomLayerRef = useRef<HTMLDivElement>(null);

  const active = images[activeIndex] ?? images[0];
  const hasMany = images.length > 1;
  const step = (delta: number) => {
    setIsZooming(false);
    setActiveIndex((current) => (current + delta + images.length) % images.length);
  };

  // Tâm phóng to ghi thẳng vào DOM: đặt qua state thì mỗi lần chuột nhích lại render lại cả bộ ảnh + dải ảnh nhỏ.
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    const layer = zoomLayerRef.current;
    if (!container || !layer) return;
    const rect = container.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    layer.style.transformOrigin = `${x}% ${y}%`;
  };

  if (!active) return null;

  return (
    <>
      <div
        ref={containerRef}
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
        className="group relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-white to-[var(--dc-primary-50)] cursor-zoom-in sm:aspect-[16/11]"
      >
        <div
          ref={zoomLayerRef}
          className="relative size-full pointer-events-none will-change-transform"
          style={{
            transform: isZooming ? 'scale(2.2)' : 'scale(1)',
            transition: isZooming ? 'none' : 'transform 0.25s ease-out',
          }}
        >
          {/* Mọi ảnh dựng sẵn chồng lên nhau, chỉ ảnh đang chọn hiện: ảnh sau tải nền (ưu tiên thấp) nên bấm
              chuyển là có ngay, không phải tải lại và không bị trắng khung giữa hai ảnh. */}
          {images.map((image, index) => (
            <Image
              key={image.id}
              src={image.url}
              alt={image.alt}
              fill
              priority={index === 0}
              fetchPriority={index === 0 ? 'high' : 'low'}
              aria-hidden={index !== activeIndex}
              sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 58vw, 740px"
              className={`object-contain p-4 sm:p-8 select-none transition-opacity duration-150 ${
                index === activeIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>

        {/* Zoom Hint Badge */}
        {!isZooming && (
          <span className="pointer-events-none absolute bottom-3 left-3 hidden items-center gap-1.5 rounded-full bg-neutral-900/60 px-2.5 py-1 text-2xs font-medium text-white/90 backdrop-blur-xs sm:inline-flex transition-opacity group-hover:opacity-0">
            <ZoomIn className="size-3.5" aria-hidden="true" /> Rê chuột để phóng to
          </span>
        )}

        {hasMany && (
          <>
            {GALLERY_ARROWS.map(({ delta, label, side, Icon }) => (
              <button
                key={delta}
                type="button"
                onClick={() => step(delta)}
                className={`absolute ${side} top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-neutral-700 shadow transition hover:bg-white focus-ring`}
                aria-label={label}
              >
                <Icon aria-hidden className="size-5" />
              </button>
            ))}
            <span className="absolute bottom-3 right-3 z-10 rounded-full bg-neutral-900/70 px-2.5 py-1 text-2xs font-bold text-white">
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
                  className={`relative block aspect-square w-full overflow-hidden rounded-xl border-2 bg-white transition focus-ring ${
                    selected
                      ? 'border-neutral-900'
                      : 'border-[var(--dc-border)] hover:border-neutral-300'
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
