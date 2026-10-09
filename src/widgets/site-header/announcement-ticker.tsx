'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { STORE_ANNOUNCEMENTS, STORE_CONTACT } from '@/shared/constants';
import { useAutoplayAllowed } from '@/shared/hooks';

/**
 * PERF: owns its own 4s rotation interval so the rest of the header (mega
 * menus, cart badge, auth state) does not re-render every tick.
 */
export function AnnouncementTicker() {
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  // Dừng khi cuộn khỏi màn hình, ẩn tab hoặc người dùng chọn giảm chuyển động.
  const autoplay = useAutoplayAllowed(rootRef);

  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % STORE_ANNOUNCEMENTS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [autoplay]);

  return (
    <div ref={rootRef} className="relative overflow-hidden bg-neutral-800 px-3 py-2 text-center text-xs font-bold uppercase tracking-[.08em] text-white/90 sm:px-4 sm:tracking-[.12em]">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="hidden items-center gap-2 text-xs font-semibold normal-case tracking-normal text-neutral-300 xl:flex">
          <span aria-hidden className="inline-block size-2 rounded-full bg-success-400" />
          <span>Showroom mở cửa {STORE_CONTACT.openingHours}</span>
        </div>

        <div className="relative flex flex-1 items-center justify-center h-5 overflow-hidden px-4 min-w-0">
          {STORE_ANNOUNCEMENTS.map((text, i) => (
            <span
              key={text}
              aria-hidden={i !== announcementIndex}
              className={`absolute inset-0 block truncate leading-5 transition-all duration-500 ${
                i === announcementIndex
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-4 opacity-0 pointer-events-none'
              }`}
            >
              {text}
            </span>
          ))}
        </div>

        <div className="hidden items-center gap-4 text-xs font-semibold normal-case tracking-normal text-neutral-300 xl:flex">
          <Link href="/contact" className="rounded transition hover:text-white">Hệ thống Showroom</Link>
        </div>
      </div>
    </div>
  );
}
