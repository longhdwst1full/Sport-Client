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
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const active = images[activeIndex] ?? images[0];
  const hasMany = images.length > 1;
  const step = (delta: number) => {
    setIsZooming(false);
    setActiveIndex((current) => (current + delta + images.length) % images.length);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPos({ x, y });
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
          className="relative size-full pointer-events-none"
          style={{
            transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
            transform: isZooming ? 'scale(2.2)' : 'scale(1)',
            transition: isZooming ? 'none' : 'transform 0.25s ease-out',
          }}
        >
          <Image
            key={active.url}
            src={active.url}
            alt={active.alt}
            fill
            priority={activeIndex === 0}
            sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 58vw, 740px"
            className="object-contain p-4 sm:p-8 select-none"
          />
        </div>

        {/* Zoom Hint Badge */}
        {!isZooming && (
          <span className="pointer-events-none absolute bottom-3 left-3 hidden items-center gap-1.5 rounded-full bg-slate-900/60 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-xs sm:inline-flex transition-opacity group-hover:opacity-0">
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
                className={`absolute ${side} top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-700 shadow transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2`}
                aria-label={label}
              >
                <Icon aria-hidden className="size-5" />
              </button>
            ))}
            <span className="absolute bottom-3 right-3 z-10 rounded-full bg-slate-900/70 px-2.5 py-1 text-[11px] font-bold text-white">
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
                  className={`relative block aspect-square w-full overflow-hidden rounded-xl border-2 bg-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 ${
                    selected
                      ? 'border-slate-900'
                      : 'border-[var(--dc-border)] hover:border-slate-300'
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
